import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { PRICE_CENTS, commissionCents } from '../../shared/pricing.js';

const directory=fs.mkdtempSync(path.join(os.tmpdir(),'kidora-test-'));
Object.assign(process.env,{DATA_DIR:directory,KIDORA_NO_LISTEN:'1',ADMIN_KEY:'test-admin-key-only',BASE_URL:'https://kidora.com.my',BAYARCASH_PAT:'test-token',BAYARCASH_SECRET_KEY:'test-secret',BAYARCASH_PORTAL_KEY:'test-portal',BAYARCASH_SANDBOX:'true',NODE_ENV:'test'});
const originalFetch=globalThis.fetch;
let sentIntent;
globalThis.fetch=async(url,options)=>{assert.match(String(url),/^https:\/\/api\.console\.bayarcash-sandbox\.com\/v3\/payment-intents$/);sentIntent=JSON.parse(options.body);return new Response(JSON.stringify({id:'test-intent',url:'https://example.com/test-checkout'}),{status:200});};
const {app}=await import('../src/server.js');
const {getOrder,saveOrder,getAffiliateData}=await import('../src/store.js');
const server=app.listen(0,'127.0.0.1');
await new Promise(resolve=>server.once('listening',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
async function request(route,{body,cookie,admin,method,origin}={}){
 const r=await originalFetch(base+route,{method:method||(body?'POST':'GET'),redirect:'manual',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...(admin?{'x-admin-key':admin}:{}),...(origin?{Origin:origin}:{})},body:body?JSON.stringify(body):undefined});
 const text=await r.text();let data;try{data=JSON.parse(text);}catch{data=text;}
 return {status:r.status,data,cookies:r.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ')};
}
function callback(order,extra={}){
 const data={record_type:'transaction',transaction_id:'txn-'+order.orderId,exchange_reference_number:'ref',exchange_transaction_id:'ex',order_number:order.orderId,currency:'MYR',amount:order.amount.toFixed(2),payer_name:order.payerName,payer_email:order.payerEmail,payer_bank_name:'Test bank',status:3,status_description:'Successful',datetime:new Date().toISOString(),...extra};
 data.checksum=crypto.createHmac('sha256','test-secret').update(Object.keys(data).sort().map(k=>data[k]).join('|')).digest('hex');return data;
}
const buyer={name:'Test Buyer',email:'buyer@example.com',phone:'0198765432'};
let accountA,accountB,sessionA,sessionB,refCookie,order;
await test('pricing and exact commission rounding',()=>{assert.deepEqual(Object.values(PRICE_CENTS),[1990,2990,3990]);assert.deepEqual(Object.values(PRICE_CENTS).map(commissionCents),[597,947,1297]);assert.equal(commissionCents(0),0);});
await test('protected reports, JSON origin validation and registration',async()=>{
 assert.equal((await request('/api/admin/sales')).status,401);
 assert.equal((await request('/api/admin/sales',{admin:'wrong'})).status,401);
 assert.equal((await request('/api/affiliate/dashboard')).status,401);
 const body={name:'Affiliate One',email:'one@example.com',phone:'0123456789',password:'test-password-1234'};
 assert.equal((await request('/api/affiliate/register',{body,origin:'https://evil.example'})).status,403);
 const a=await request('/api/affiliate/register',{body,origin:'https://affiliate.kidora.com.my'});assert.equal(a.status,201);accountA=a.data.account;sessionA=a.cookies;
 const b=await request('/api/affiliate/register',{body:{...body,name:'Affiliate Two',email:'two@example.com'}});assert.equal(b.status,201);accountB=b.data.account;sessionB=b.cookies;
 assert.equal((await request('/api/affiliate/register',{body:{...body,email:'ONE@example.com'}})).status,409);
 assert.equal((await request('/api/affiliate/login',{body:{email:body.email,password:'incorrect'}})).status,401);
 assert.equal((await request('/api/affiliate/login',{body:{email:body.email,password:body.password}})).status,200);
 const stored=getAffiliateData();assert.equal(stored.accounts[accountA.id].password,undefined);assert.notEqual(stored.accounts[accountA.id].passwordHash,body.password);
});
await test('referral deduplication, signed attribution and server-side prices',async()=>{
 assert.equal((await request('/r/__proto__')).status,404);
 await request('/r/'+accountA.id,{method:'HEAD'});
 const first=await request('/r/'+accountA.id);assert.equal(first.status,302);refCookie=first.cookies;
 await request('/r/'+accountA.id,{cookie:refCookie});
 let d=await request('/api/affiliate/dashboard',{cookie:sessionA});assert.equal(d.data.summary.visits,1);
 const r=await request('/api/order',{cookie:refCookie,body:{...buyer,package:'asas',amount:0.01,affiliateId:accountB.id}});assert.equal(r.status,200);order=getOrder(r.data.orderId);
 assert.equal(order.amount,19.90);assert.equal(order.affiliateId,accountA.id);assert.equal(order.expectedCommissionCents,597);assert.equal(order.commissionCents,undefined);assert.equal(sentIntent.amount,'19.90');assert.deepEqual(sentIntent.payment_channel,[1,6]);
 const forged=await request('/api/order',{cookie:'kidora_ref=forged.signature',body:{...buyer,package:'lengkap'}});assert.equal(getOrder(forged.data.orderId).affiliateId,undefined);
 const last=await request('/r/'+accountB.id,{cookie:refCookie});const b=await request('/api/order',{cookie:last.cookies,body:{...buyer,package:'keluarga'}});assert.equal(getOrder(b.data.orderId).affiliateId,accountB.id);
});
await test('callbacks verify signature, amount, currency; settle and commission exactly once',async()=>{
 assert.equal((await request('/api/bayarcash/callback',{body:{...callback(order),checksum:'bad'}})).status,400);
 assert.equal((await request('/api/bayarcash/callback',{body:callback(order,{amount:'0.01'})})).status,400);
 assert.equal((await request('/api/bayarcash/callback',{body:callback(order,{currency:'USD'})})).status,400);
 assert.equal(getOrder(order.orderId).status,'pending');
 assert.equal((await request('/api/bayarcash/callback',{body:callback(order)})).status,200);
 const settled=getOrder(order.orderId);assert.equal(settled.commissionCents,597);assert.equal(settled.codes.length,1);
 await request('/api/bayarcash/callback',{body:callback(order)});await request('/api/bayarcash/callback',{body:callback(order,{status:4})});
 assert.deepEqual(getOrder(order.orderId),settled);
 assert.equal((await request('/api/bayarcash/callback',{body:callback(order,{transaction_id:'different'})})).status,409);
});
await test('affiliate privacy, reporting, filters and commission payout audit',async()=>{
 const a=(await request('/api/affiliate/dashboard',{cookie:sessionA})).data;assert.equal(a.summary.revenueCents,1990);assert.equal(a.summary.commissionCents,597);assert.equal(a.sales.length,1);
 const serialized=JSON.stringify(a);for(const secret of [buyer.email,buyer.phone,buyer.name,order.orderId,getOrder(order.orderId).codes[0],'passwordHash'])assert.equal(serialized.includes(secret),false);
 const b=(await request('/api/affiliate/dashboard',{cookie:sessionB})).data;assert.equal(b.summary.paid,0);
 const admin='test-admin-key-only';let report=(await request('/api/admin/sales',{admin})).data;assert.equal(report.summary.revenueCents,1990);assert.equal(report.affiliates.length,2);assert.equal(report.orders.find(o=>o.orderId===order.orderId).payerEmail,buyer.email);
 assert.equal((await request('/api/admin/sales?from=9999-01-01',{admin})).data.orders.length,0);
 assert.equal((await request('/api/admin/sales?from=invalid',{admin})).status,400);
 assert.equal((await request(`/api/admin/commission/${order.orderId}/paid`,{admin,body:{reference:''}})).status,400);
 assert.equal((await request(`/api/admin/commission/${order.orderId}/paid`,{admin,body:{reference:'BANK-TEST-001'}})).status,200);
 const paid=getOrder(order.orderId);await request(`/api/admin/commission/${order.orderId}/paid`,{admin,body:{reference:'duplicate'}});assert.deepEqual(getOrder(order.orderId),paid);
 report=(await request('/api/admin/sales',{admin})).data;assert.equal(report.summary.paidCommissionCents,597);assert.equal(report.summary.unpaidCommissionCents,0);
 await request('/api/affiliate/logout',{cookie:sessionA,body:{}});assert.equal((await request('/api/affiliate/dashboard',{cookie:sessionA})).status,401);
});
await test('reports include more than 200 records and existing order prices persist',async()=>{
 for(let i=0;i<205;i++)saveOrder({orderId:'old-'+i,package:'asas',amount:9.90,status:'paid',codes:[],createdAt:'2025-01-01T00:00:00.000Z'});
 const r=(await request('/api/admin/sales?from=2025-01-01&to=2025-01-01',{admin:'test-admin-key-only'})).data;
 assert.equal(r.orders.length,205);assert.equal(r.summary.revenueCents,205*990);
});
server.closeAllConnections();await new Promise(resolve=>server.close(resolve));globalThis.fetch=originalFetch;fs.rmSync(directory,{recursive:true,force:true});
