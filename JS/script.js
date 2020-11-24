var element = $('.proj');

var u= $('.up');
var d= $('.dn');



$(document).ready(function() {
 //$("html").niceScroll();

  var curPage = 1;
  var numOfPages = $(".skw-page").length;
  var animTime = 1000;
  var scrolling = false;
  var pgPrefix = ".skw-page-";

  function pagination() {
    scrolling = true;

    $(pgPrefix + curPage).removeClass("inactive").addClass("active");
    $(pgPrefix + (curPage - 1)).addClass("inactive");
    $(pgPrefix + (curPage + 1)).removeClass("active");

    setTimeout(function() {
      scrolling = false;
    }, animTime);
  };

  function navigateUp() {
    if (curPage === 1) return;
    curPage--;
    pagination();
  };

  function navigateDown() {
    if (curPage === numOfPages) return;
    curPage++;
    pagination();
  };

function disableScrolling(){
    var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
}

function enableScrolling(){
    window.onscroll=function(){};
}

  $(element).on("mousewheel DOMMouseScroll", function(e) {
console.log(curPage);
  if(curPage<5 && curPage>1){
    console.log("sc ...in if");
    console.log(curPage);
    document.body.style.overflow = "hidden";
    if (scrolling) return;
    
    if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0){
      navigateUp();
      //element[0].scrollIntoView();
      $(element).scrollTop(0);
    } 
    else { 
      navigateDown();
      //element[0].scrollIntoView();     
      $(element).scrollTop(0);
    }
    
  }
    else if(curPage==1){

      document.body.style.overflow = "visible";
      if(!(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0))      
      {navigateDown();
      //element[0].scrollIntoView(); 
    }
      $(element).scrollTop(0);

      console.log("sc ...in else");
      console.log(curPage);
    }

    else if(curPage==5){
      document.body.style.overflow = "visible";
      if((e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0)){
      navigateUp();
      //element[0].scrollIntoView(); 
    }
      $(element).scrollTop(0);
      console.log("sc ...in else");
      console.log(curPage);
    }

  
  });

  $(element).on("keydown", function(e) {
    console.log(curPage);

    if(curPage<5 && curPage>1){
    document.body.style.overflow = "hidden";
 if (scrolling) return;
    if (e.which === 38) {
      navigateUp();
      //element[0].scrollIntoView();
      $(element).scrollTop(0);
      

    } else if (e.which === 40) {
      navigateDown();
      //element[0].scrollIntoView();
      $(element).scrollTop(0);
      
    }
  }
    else if(curPage==1 && e.which === 40){
      document.body.style.overflow = "visible";
      navigateDown();
      //element[0].scrollIntoView();
      $(element).scrollTop(0);
    }

    else if(curPage==5 && e.which === 38){
      document.body.style.overflow = "visible";
      navigateUp();
      //element[0].scrollIntoView();
      $(element).scrollTop(0);
    }

   

  });

});


