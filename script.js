const form=document.getElementById('transactionForm');
const list=document.getElementById('transactionList');
const empty=document.getElementById('emptyState');
const fmt=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
let transactions=JSON.parse(localStorage.getItem('granaCerta'))||[];

document.getElementById('date').value=new Date().toISOString().split('T')[0];

function save(){localStorage.setItem('granaCerta',JSON.stringify(transactions));}
function render(){
  let income=transactions.filter(t=>t.type==='income').reduce((a,t)=>a+Number(t.amount),0);
  let expense=transactions.filter(t=>t.type==='expense').reduce((a,t)=>a+Number(t.amount),0);
  document.getElementById('income').textContent=fmt(income);
  document.getElementById('expense').textContent=fmt(expense);
  document.getElementById('balance').textContent=fmt(income-expense);
  list.innerHTML='';
  empty.style.display=transactions.length?'none':'block';
  [...transactions].sort((a,b)=>new Date(b.date)-new Date(a.date)).forEach(t=>{
    const li=document.createElement('li');
    li.className='transaction';
    li.innerHTML=`<div class="left"><strong>${escapeHtml(t.description)}</strong><small>${t.category} • ${new Date(t.date+'T12:00:00').toLocaleDateString('pt-BR')}</small></div>
    <div class="valuebox"><span class="${t.type}">${t.type==='income'?'+':'-'} ${fmt(t.amount)}</span><button class="delete" onclick="removeTransaction('${t.id}')">×</button></div>`;
    list.appendChild(li);
  });
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function removeTransaction(id){transactions=transactions.filter(t=>t.id!==id);save();render();}
form.addEventListener('submit',e=>{
  e.preventDefault();
  const t={id:Date.now().toString(),description:description.value.trim(),amount:parseFloat(amount.value),type:type.value,category:category.value,date:date.value};
  transactions.push(t);save();render();form.reset();date.value=new Date().toISOString().split('T')[0];
});
document.getElementById('clearBtn').onclick=()=>{if(confirm('Deseja apagar todas as movimentações?')){transactions=[];save();render();}};
document.getElementById('themeBtn').onclick=()=>{document.body.classList.toggle('dark');document.getElementById('themeBtn').textContent=document.body.classList.contains('dark')?'🌙':'☀️';};
render();
