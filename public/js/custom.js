window.addEventListener("load", function(){
    let customizations = [];
    let template = $("#templateid").val();
    let price = parseFloat($("#price").val());

    $(".addbtn").click(function(){
        let val = $(this).attr("value");
        let msg = "#"+val+"msg";
        let id = "#"+val+"id";
        let removebtn = "#"+val+"remove";
        let addbtn = "#"+val+"add";
        let customPrice = "#"+val+"price";

        $(msg).removeAttr("hidden");
        customizations.push($(id).val());

        $(removebtn).removeClass("disabled");
        $(addbtn).addClass("disabled");

        $("#total").html("Total: $"+(price + parseFloat($(customPrice).val())));
        price = price + parseFloat($(customPrice).val());
    });

    $(".removebtn").click(function(){
        let val = $(this).attr("value");
        let msg = "#"+val+"msg";
        let id = "#"+val+"id";
        let removebtn = "#"+val+"remove";
        let addbtn = "#"+val+"add";
        let customPrice = "#"+val+"price";

        $(msg).attr("hidden", "true");
        customizations.splice(customizations.indexOf($(id).val()), 1);

        $(addbtn).removeClass("disabled");
        $(removebtn).addClass("disabled");
        
        $("#total").html("Total: $"+(price - parseFloat($(customPrice).val())));
        price = price - parseFloat($(customPrice).val());
    });

    $("#orderbtn").click(function(){
        fetch("http://localhost:3000/customizer/checkout", {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                customizations: customizations,
                template: template
            })
        }).then(res => {
            if (res.ok) return res.json()
            return res.json().then(json => Promise.reject(json))
        }).then(({url}) => {
            window.location = url
        }).catch(e =>{
            console.error(e.error)
        });
    });

});