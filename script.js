const itemSection=document.getElementById("itemSection");
const addElement=document.getElementById("addElement");

document.getElementById("addButton").addEventListener("click",addNewElement);
document.getElementById("viewAll").addEventListener("click",viewAll);
document.getElementById("viewActive").addEventListener("click",viewActive);
document.getElementById("clearCompleted").addEventListener("click",clearCompleted);
document.getElementById("clearAll").addEventListener("click",clearAll);

var itemList=[];
// Add new Element to the list 
function addNewElement(){
 const inputText=document.getElementById("inputText").value;
 if(inputText!==""){
 document.getElementById("inputText").value="";
 const id =Date.now();
 itemList.push({
     _id:id,
     isChecked:false,
     itemContent:inputText
 });

 viewAll();
 }
}


// displaying elements
function displayRow(item){
    const node=document.createElement("div");
    node.setAttribute("id",item._id);
    node.setAttribute("draggable",true);
    node.setAttribute("class","itemcontainer itemcontainer-S draggable");
    node.innerHTML='<div class="checkBox"><input  type="checkbox"'+(item.isChecked ? "checked":"")+'/></div><div class="contentBox"><span>'+item.itemContent.slice(0,25)+'</span></div><div class="removeButtonBox"><button class="removeButton">x</button></div>';
    itemSection.appendChild(node);
    node.lastChild.firstChild.addEventListener("click",removeElement);
    node.firstChild.firstChild.addEventListener("click",toggleCheckBox);
    if(item.isChecked){
        node.getElementsByClassName("contentBox")[0].firstChild.classList.add("checkboxChecked");
    }

    node.addEventListener("dragstart",()=>{
        node.classList.add("dragging")
    })
    node.addEventListener("dragend",()=>{
        node.classList.remove("dragging")
        reOrder();
    })
}
function displayElements(){   
    for(var i=0;i<itemList.length;i++){
        displayRow(itemList[i]);
    }
    }
    
    function displayActiveElements(){   
        for(var i=0;i<itemList.length;i++){
            if(!itemList[i].isChecked){
                displayRow(itemList[i]);
            }
        }
    }
function viewAll(){
    clearAllfromView();
    displayElements();
    itemSection.firstChild.classList.remove("itemcontainer");
    itemSection.firstChild.classList.remove("itemcontainer-S");
    itemSection.firstChild.classList.add("topItemcontainer");
    itemSection.firstChild.classList.add("topItemcontainer-S");
    counter();
}
function viewActive(){
    clearAllfromView();
    displayActiveElements();
    itemSection.firstChild.classList.remove("itemcontainer");
    itemSection.firstChild.classList.remove("itemcontainer-S");
    itemSection.firstChild.classList.add("topItemcontainer");
    itemSection.firstChild.classList.add("topItemcontainer-S");
    counter();
}

//removing elements
function removeElement(){
    const id=this.parentElement.parentElement.id;
    itemList=itemList.filter((value)=>{
        return !(value._id==id);
    })
    counter();
    console.log(itemList);
    this.parentElement.parentElement.remove();
    
}
function clearAll(){
    clearAllfromView();
    itemList=[];
    counter();
}
function clearCompleted(){
    itemList=itemList.filter((value)=>{
        return !value.isChecked;
    })
    viewAll();
}


//Other helping function to clear screen,toggle the checkbox 
// and count the active items
function clearAllfromView(){
    while(itemSection.hasChildNodes()){
        itemSection.removeChild(itemSection.firstChild);
    }
}

function toggleCheckBox(){
    for(var i=0;i<itemList.length;i++){
        if(itemList[i]._id==this.parentElement.parentElement.id){
            itemList[i].isChecked=!itemList[i].isChecked;
            break;
        }
    }
    this.parentElement.parentElement.getElementsByClassName("contentBox")[0].firstChild.classList.toggle("checkboxChecked");
    counter();
}
function counter(){
    let count=0;
    for(var i=0;i<itemList.length;i++){
        if(!itemList[i].isChecked){
            count++;
        }
    }
    document.getElementById("currentCount").innerHTML=count+" items left";

}

//Listen to Enter key press
document.addEventListener("keyup", function(event) {
    if (event.code === "Enter") {
        addNewElement();
    }
});

//Dragging functionality
itemSection.addEventListener("dragover", e=>{
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY)
    const draggable = document.querySelector('.dragging')
    if (afterElement == null) {
      itemSection.appendChild(draggable)
    } else {
      itemSection.insertBefore(draggable, afterElement)
    }
})

function getDragAfterElement(y) {
    const draggableElements = [...itemSection.querySelectorAll('.draggable:not(.dragging)')]
  
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element
  }

  function reOrder(){
      let elements = [...itemSection.querySelectorAll('.draggable')];
      itemList=[];
      elements.forEach(x=>{
          const elementId=x.id;
          const elementIsChecked=x.getElementsByTagName("input")[0].checked;
          const elementContent=x.getElementsByTagName("span")[0].innerHTML;
          
          itemList.push({
            _id:elementId,
            isChecked:elementIsChecked,
            itemContent:elementContent
        });
       
      })
      viewAll();
  }