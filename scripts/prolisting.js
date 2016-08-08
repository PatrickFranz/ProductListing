var showCartBtns = document.getElementsByClassName('view-cart');
var cartElem = document.getElementById('cart');
var items = document.getElementsByTagName('li')
onload = function(){
  addListeners();
}

function addListeners(){
  for(var i=0; i < showCartBtns.length; i++){
    showCartBtns[i].addEventListener('click', function(event){
     if(cartElem.className === ''){
       cartElem.className = "hidden";
      } else {
        cartElem.className = '';
      }
    });
  }
}

function makeLineItem(node){
  
}

function addRow(obj){

}

function removeRow(rowNum){

}