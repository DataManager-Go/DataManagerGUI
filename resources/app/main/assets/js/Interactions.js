// TODO Use highlighted info to do stuff (edit, delete, download)

function highlight(){
    var table = document.getElementById('fileTable');
    for (var i=0;i < table.rows.length;i++){
     table.rows[i].onclick= function () {
      if(!this.hilite){
       this.origColor=this.style.backgroundColor;
       this.style.backgroundColor='#BCD4EC';
       this.hilite = true;
      }
      else{
       this.style.backgroundColor=this.origColor;
       this.hilite = false;
      }
       }
    }
}