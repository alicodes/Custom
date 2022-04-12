window.addEventListener("load", function(){
    let type = 0;
    let customizations = [];
    let image;

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

    $(".addbtn").click(function(){
        if (customizations.includes($(this).attr("value"))) {
            customizations.splice(customizations.indexOf($(this).attr("value")), 1)
        } else {
            customizations.push($(this).attr("value"));
        };

        $("#nextbtn2").removeAttr("disabled");
    });

    $("#nextbtn2").click(function(){
        $(".cusdiv").hide();
        $(".upload").removeAttr("hidden");
    });

    $("#garmet").change(function(){
        const [file] = garmet.files
        console.log(garmet.files);
        if (file) {
          blah.src = URL.createObjectURL(file)
          $("#blah").removeAttr("hidden");
        }
    });

    $("#postbtn").click(function(){
        $('#postform').submit();

        $.post("http://localhost:3000/designer/post",
        {
            name: $("#tname").val(),
            type: type,
            customizations: customizations,
            customimg: "custom img url",
            customizationDes: "rando",
            image: garmet.files[0].name,
            description: $("#des").val(),
            price: $("#price").val()
        },
        function(data, status){
            window.location.replace("http://localhost:3000/designer");
        });
        
        /* $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/designer/post',
            data: JSON.stringify({yerp:"dunnoe"}),
            dataType: 'json',
            contentType: 'application/json',
            success: function(jsondata){
                console.log("wuddup");
            }
         }); */
    });

});