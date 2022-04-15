window.addEventListener("load", function(){
    let type = "";
    let customizations = [];

    $("#shirt").click(function(){
        type = "shirt";
        $("#nextbtn1").removeAttr("disabled");
    });

    $("#jacket").click(function(){
        type = "jacket";
        $("#nextbtn1").removeAttr("disabled");
    });

    $("#pants").click(function(){
        type = "pants";
        $("#nextbtn1").removeAttr("disabled");
    });

    $("#nextbtn1").click(function(){
        $(".typediv").hide();
        $(".cusdiv").removeAttr("hidden");
    });

    $(".addbtn").click(function(){
        let val = $(this).attr("value");
        let price = "#"+val+"price";
        let text = "#"+val+"text";

        let index = 0;

        customizations.forEach(element => {
            if (element.customtype == val){
                customizations.splice(index, 1);
            };
            index++;
        });

        customizations.push({customtype: val, price: $(price).val(), description: $(text).val()});
        /* if (customizations.includes($(this).attr("value"))) {
            customizations.splice(customizations.indexOf($(this).attr("value")), 1)
        } else {
            customizations.push($(this).attr("value"));
        }; */

        console.log(customizations);

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
            image: garmet.files[0].name,
            description: $("#des").val(),
            price: $("#price").val()
        },
        function(){
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