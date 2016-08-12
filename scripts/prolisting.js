var cartNode = document.getElementById('cart');
var cartTableNode = document.getElementById('shop-cart');
var itemsNode = document.getElementsByTagName('li');
var grandSubNode = document.getElementById('grand-sub');
var grandTotalNode = document.getElementById('grand-total');
var showCartBtns = document.getElementsByClassName('view-cart');
var addCartBtns = document.getElementsByClassName('add-cart');
var applyDiscBtn = document.getElementById('apply-disc');
var discountInp = document.getElementById('coupon');
var savingsNode = document.getElementById('savings')
var discAmountNode = document.getElementById('disc-amount');
var coupons = new Set(['TENOFFONE', 'SAVEBIG15', 'FIVEOFFALL']);
var itemsInCart = [];
var itemObjs = [];
var grandDisc = 0.00;
var grandSub = 0.00;
var grandTotal = 0.00;

onload = function(){
  if(cartTableNode.rows.length <= 1){
    hideCart();
  }
  addListeners();
  createObjList(itemsNode);
}

function addListeners(){
  //Show/Hide cart button
  for(var i=0; i < showCartBtns.length; i++){
    showCartBtns[i].addEventListener('click', function(event){
     if(cartNode.className === ''){
       hideCart();
      } else {
        showCart();
      }
    });
  }

  //Add to cart buttons
  for(var i=0; i < addCartBtns.length; i++){
    addCartBtns[i].addEventListener('click', function(event){
      var id = this.parentNode.parentNode.dataset.id;
      var obj;
      // retrieve obj
      for(var i=0; i < itemObjs.length; i++){
        if(itemObjs[i].itemId === id){
          obj = itemObjs[i];
        }
      }
      if(id !== undefined){
        showCart();
        obj.qty = 1;
        itemsInCart.push(obj);
        addRow(obj);
      }  
    });
  }

  //Apply Discount
  applyDiscBtn.addEventListener('click', function(){
    applyDiscount(document.getElementById('coupon').value);
    updateLineItems();
    updateGrandTotals();
  });
}

function showCart(){
    cartNode.classList.remove('hidden')
  }

function hideCart(){
    cartNode.classList.add('hidden');
  }

//Create a list of objects from the data in the HTML table
function createObjList(arr){
  for(var i=0; i < arr.length; i++){
    var id = arr[i].dataset.id;
    var img = arr[i].children[0].getAttribute('src');
    var desc = arr[i].children[1].innerHTML
    var price = arr[i].children[2].getElementsByClassName('p-price')[0].innerHTML;
    price = parseFloat(price.slice(1));
    var itemObj = {
      itemId : id,
      itemImg : img,
      itemDesc : desc,
      itemPrice : price,
      itemDiscAmount: 0.00
    }
    itemObjs.push(itemObj);
  }
}

//Adds a new row from the supplied object to the cart table
function addRow(obj){
  var newRow = cartTableNode.insertRow(-1)
  var trashCell = newRow.insertCell(0);
  var imgCell = newRow.insertCell(1);
  var descCell = newRow.insertCell(2);
  var priceCell = newRow.insertCell(3);
  var qtyCell = newRow.insertCell(4);
  var subCell = newRow.insertCell(5);
  var subTotal = (obj.itemPrice - obj.itemDiscAmount) * obj.qty;

  trashCell.innerHTML = "<td class='sc-trash'><img src='images/trash.png' alt='Trash' width='25'   height='25' onclick = removeRow(this.parentNode.parentNode.rowIndex,'" + obj.itemId + "')></td>";
  imgCell.innerHTML = "<td><img src='" + obj.itemImg + "' alt='' height='100px'></td>";
  descCell.innerHTML = "<td><p class='sc-desc ta-left'>" + obj.itemDesc + "</p><p class='sc-prod-num'>Product: " + obj.itemId + "</p></td>";
  priceCell.innerHTML = "<td>$" + obj.itemPrice.toFixed(2) + "</td><br><td><span class= 'cart-discount' id='disc-td" + newRow.rowIndex + "'>-$" + obj.itemDiscAmount + "</span></td>";
  if(obj.itemDiscAmount > 0){
    document.getElementById('disc-td' + newRow.rowIndex).classList.remove('hidden');
  } else {
    document.getElementById('disc-td' + newRow.rowIndex).classList.add('hidden');
  }
  //give each qty input its own id based on its initial row assignment
  qtyCell.innerHTML = "<td><input class='sc-qty' type='number' id='qty-row-" + newRow.rowIndex + "' min='1' max='99' size='2' value='" + obj.qty + "'></td>";
  qtyCell.addEventListener('change', function(){
    obj.qty = parseInt(document.getElementById('qty-row-' + newRow.rowIndex).value);
    subTotal = (obj.itemPrice - obj.itemDiscAmount) * obj.qty;
     subCell.innerHTML = "<td id=subtotal>$" + subTotal.toFixed(2)  + "</td>";
    updateGrandTotals();
  });
  subCell.innerHTML = "<td id=subtotal>$" + subTotal.toFixed(2)  + "</td>";
  updateGrandTotals();
}

function removeRow(rowNum, id){
  cartTableNode.deleteRow(rowNum);
  for(var i=0; i < itemsInCart.length; i++){
    if(itemsInCart[i].itemId === id){
      itemsInCart.splice(i, 1);
    }
  }
  updateGrandTotals();
}

function updateLineItems(){
  //Remove lineItems. Row 0 is the Header. Start loop at 1
  for(var i=1; i < cartTableNode.rows.length; ){
    cartTableNode.deleteRow(i);
  }
  //Re-add lineItems
  for(var i=0; i < itemsInCart.length; i++){
    addRow(itemsInCart[i]);
  }
}

function updateGrandTotals(){
  grandSub = 0.00;
  grandTotal = 0.00;
  var tax = 1.05;
  
  for(var i=0; i < itemsInCart.length; i++){
    grandSub += (itemsInCart[i].itemPrice - itemsInCart[i].itemDiscAmount) * itemsInCart[i].qty;
  }
  grandSubNode.innerHTML   = "$" + grandSub.toFixed(2);
  discAmountNode.innerHTML = "$" + calculateDiscount();
  grandTotalNode.innerHTML = "$" + (grandSub * tax).toFixed(2);
}

function applyDiscount(code){
    //-10% off most expensive item.
    var TENOFFONE = function(){
      if(coupons.has('TENOFFONE')){
        var disc = 0.1;
        var highest = itemsInCart[0];
        //Grab most expensive item.
        for(var i=0; i < itemsInCart.length; i++){
          if(itemsInCart[i].itemPrice > highest.itemPrice){
            highest = itemsInCart[i];
          }
        }
        //Apply discount to item.
        var discAmt = (highest.itemPrice - highest.itemPrice * (1 - disc)).toFixed(2);
        if(discAmt > highest.itemDiscAmount){
          highest.itemDiscAmount = discAmt;
          coupons.delete('TENOFFONE');
          savingsNode.classList.remove('hidden');
        } else {
          console.log('This coupon will not lower your price.');
        }
      } else {
        console.log('Coupon already used.');
      }
    }  
    //-15% off all items < $100.00.
    var SAVEBIG15 = function(){
      if(coupons.has('SAVEBIG15')){
        var disc = 0.15;
        for(var i=0; i < itemsInCart.length; i++){
          if(itemsInCart[i].itemPrice < 100.00){
            var discAmt = itemsInCart[i].itemPrice - itemsInCart[i].itemPrice * (1 - disc);
            if(discAmt > itemsInCart[i].itemDiscAmount){
              itemsInCart[i].itemDiscAmount = discAmt.toFixed(2);
              coupons.delete("SAVEBIG15");
              savingsNode.classList.remove('hidden');
            } else {
              console.log('This coupon will not lower your price.');
            }
          }
        }
      } else {
        console.log('Coupon already used.');
      }
    }
    // -5% off subtotal
    var FIVEOFFALL = function(){
      if(coupons.has('FIVEOFFALL')){
        var disc = 0.05;
        for(var i=0; i < itemsInCart.length; i++){
          var discAmt = itemsInCart[i].itemPrice - itemsInCart[i].itemPrice * (1 - disc);
          if(discAmt > itemsInCart[i].itemDiscAmount){
            itemsInCart[i].itemDiscAmount = discAmt.toFixed(2);
            coupons.delete('FIVEOFFALL');
          } else {
            console.log('This coupon will not lower your price.');
          }
        }
        savingsNode.classList.remove('hidden');
      }
    }

    var notCoupon = function(){
      console.log('Invalid coupon code');
    }

    switch(code){
      case 'TENOFFONE':
        TENOFFONE();
        break;
      case 'SAVEBIG15':
        SAVEBIG15();
        break;
      case 'FIVEOFFALL':
        FIVEOFFALL();
        break;
      default:
        notCoupon();
        break;
    }
}

function calculateDiscount(){
  var ttl = 0.00;
  for(var i=0; i < itemsInCart.length; i++){
    ttl += parseFloat(itemsInCart[i].itemDiscAmount);
  }
  return ttl.toFixed(2);
}

