window.addEventListener("load", function(){
    let type = 0;
    let customizations = [];

    $("#shirt").click(function(){
        type = 1;
        $("#nextbtn1").removeAttr("disabled");
    });

    $("#jacket").click(function(){
        type = 2;
        $("#nextbtn1").removeAttr("disabled");
    });

    $("#pants").click(function(){
        type = 3;
        $("#nextbtn1").removeAttr("disabled");
    });

    $("#nextbtn1").click(function(){
        $(".typediv").hide();
        $(".cusdiv").removeAttr("hidden");
    });

    $(".customization").click(function(){
        $("#nextbtn2").removeAttr("disabled");
    });

    $("#nextbtn2").click(function(){
        $(".cusdiv").hide();
        $(".upload").removeAttr("hidden");
    });
});