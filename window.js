//Dynamic view generation from data
function escapeQuotes(string) {
  return string.replace(/["]+/g, '&quot;');
}
var mainAccordion = document.getElementById("main_accordion");
for (var categories in data) {
  var category = data[categories];
  var generateCategory = '';
  generateCategory += `
    <div class="accordionItem close">
      <div class="accordionItemHeading">${categories}</div>
      <div class="accordionItemContent">  
  `;
  for (var element in category) {
    generateCategory += `
      <div class="selection">
        <span class="check">
          <input onclick="checkBoxClicked(this)" type="checkbox" id="${escapeQuotes(element)}">
          <label for="${escapeQuotes(element)}"></label>
        </span>
        <span class="text">${element}</span>
      </div>
    `;
  }
  generateCategory += `
      </div>
    </div>
  `;
  main_accordion.innerHTML += generateCategory;
}


//Accordion functionality here
var accItem = document.getElementsByClassName('accordionItem');
var accHD = document.getElementsByClassName('accordionItemHeading');
for (i = 0; i < accHD.length; i++) {
  accHD[i].addEventListener('click', toggleItem, false);
}
function toggleItem() {
  var itemClass = this.parentNode.className;
  for (i = 0; i < accItem.length; i++) {
    accItem[i].className = 'accordionItem close';
  }
  if (itemClass == 'accordionItem close') {
    this.parentNode.scrollTop = 0;
    this.parentNode.className = 'accordionItem open';
    this.parentNode.scrollIntoView()
  }
}


//Checked checkboxes logic
var arrayOfFlatData = Object.keys(data).map(val => data[val]);
var flatData = arrayOfFlatData.reduce(function (acc, x) {
  for (var key in x) acc[key] = x[key];
  return acc;
}, {});

var selectedText = {}

function checkBoxClicked(checkbox) {
  if (checkbox.checked) {
    selectedText[checkbox.id] = flatData[checkbox.id];
    selectedGuideUpdate();
  }
  else {
    delete selectedText[checkbox.id];
    selectedGuideUpdate();
  }
}


//Display selected keys in guide
var infoGuideList = document.getElementById('infoGuideList');
function selectedGuideUpdate()
{
  infoGuideList.innerHTML = '';
  for (var key in selectedText) {
    var categoryName = '';
    for(var category in data)
    {
      if(key in data[category])
      {
        categoryName = category;
        break;
      }
    }
    infoGuideList.innerHTML += `
      <li>[${categoryName}] - ${escapeQuotes(key)}</li>
    `
  }
  if(document.getElementById('totoroMove').checked)
  {
    copy();
  }
}


//Copying to clipboard logic
function enableAutoCopy(){
  var isChecked = document.getElementById('totoroMove').checked;
  document.getElementById('totoroMove').checked = !isChecked;
  if(!isChecked)
  {
    copy();
  }
}

function copy() {
  const selectedValues = Object.keys(selectedText).map(key => selectedText[key]).join('\n\n');
  copyToClipboard(selectedValues);
}

const copyToClipboard = str => {
  const el = document.createElement('textarea'); 
  el.value = str;                                
  el.setAttribute('readonly', '');               
  el.style.position = 'absolute';                
  el.style.left = '-9999px';                     
  document.body.appendChild(el);                 
  const selected =            
    document.getSelection().rangeCount > 0       
      ? document.getSelection().getRangeAt(0)    
      : false;                                   
  el.select();                                   
  document.execCommand('copy');                  
  document.body.removeChild(el);                 
  if (selected) {                                
    document.getSelection().removeAllRanges();   
    document.getSelection().addRange(selected);  
  }
};
