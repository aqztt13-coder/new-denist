var SHEET_URL='https://script.google.com/macros/s/AKfycby69rrxhZs5YTKXDgDkpxievTFxYke7C0O0Imirez-tmlPg40q5a2ynCs6sdg1AXKpL/exec';
(function(){
var times=['09:00 ص','10:00 ص','11:00 ص','12:00 م','02:00 م','03:00 م','04:00 م','05:00 م','06:00 م','07:00 م'];
var slots=document.getElementById('slots');
times.forEach(function(t,i){
  var l=document.createElement('label');l.className='slot';
  l.innerHTML='<input type="radio" name="time" value="'+t+'"'+(i===0?' required':'')+'>'+t;
  slots.appendChild(l);
});
var d=document.getElementById('date');
var now=new Date();now.setDate(now.getDate()+1);
var min=now.toISOString().slice(0,10);
d.min=min;d.value=min;
var f=document.getElementById('f'),err=document.getElementById('err'),done=document.getElementById('done'),sum=document.getElementById('sum');
f.addEventListener('submit',function(e){
  e.preventDefault();
  var v=function(id){return document.getElementById(id).value.trim()};
  var t=f.querySelector('input[name=time]:checked');
  if(!v('name')||!v('phone')||!v('age')||!v('reason')||!v('date')||!t){err.textContent='يرجى تعبئة الحقول المطلوبة (*) واختيار الوقت.';return}
  if(!/^[0-9+\s-]{8,15}$/.test(v('phone'))){err.textContent='رقم الهاتف غير صحيح. أدخل أرقاماً فقط.';return}
  if(new Date(v('date')).getDay()===5){err.textContent='العيادة مغلقة يوم الجمعة. اختر يوماً آخر.';return}
  err.textContent='';
  var cond=[].map.call(f.querySelectorAll('input[name=cond]:checked'),function(c){return c.value}).join('، ')||'لا يوجد';
  var rows=[['الاسم',v('name')],['الهاتف',v('phone')],['العمر',v('age')],['الجنس',f.gender.value],['نوع الزيارة',f.visit.value],['سبب الزيارة',v('reason')],['الحالة الصحية',cond],['الحساسية',v('allergy')||'لا يوجد'],['الطبيب',v('doc')],['التاريخ',v('date')],['الوقت',t.value]];
  try{
    fetch(SHEET_URL,{method:'POST',mode:'no-cors',body:JSON.stringify({
      name:v('name'),phone:v('phone'),age:v('age'),gender:f.gender.value,visit:f.visit.value,
      reason:v('reason'),cond:cond,allergy:v('allergy')||'لا يوجد',notes:v('notes'),
      doc:v('doc'),date:v('date'),time:t.value})});
  }catch(x){}
  sum.innerHTML='';
  rows.forEach(function(r){var x=document.createElement('div'),a=document.createElement('span'),b=document.createElement('b');a.textContent=r[0];b.textContent=r[1];x.appendChild(a);x.appendChild(b);sum.appendChild(x)});
  f.style.display='none';done.style.display='block';done.scrollIntoView({block:'center'});
});
document.getElementById('again').addEventListener('click',function(){
  f.reset();d.value=min;done.style.display='none';f.style.display='block';
});
})();
