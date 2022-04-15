window.addEventListener("load", function(){
    document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
    const socket = io();
    let selecteduser = "";

    function outputMessage(msg){
        let date = (new Date()).toString();
        let formated = date.slice(4, 10) +" "+date.slice(16, 21);
        let html = $("#chatbox").html();
        let newhtml = html += 
        `<div class="d-flex align-items-baseline text-end justify-content-end mb-2">
            <div class="pe-2">
                <div class="card d-inline-block bg-primary text-light p-2">${msg}</div>
                <div class="small">${formated}</div>
            </div>
        </div>`;
        $("#chatbox").html(newhtml);
    };

    function inputMessage(msg){
        let date = (new Date()).toString();
        let formated = date.slice(4, 10) +" "+date.slice(16, 21);
        let html = $("#chatbox").html();
        let newhtml = html += 
        `<div class="d-flex align-items-baseline mb-2">
            <div class="pe-2">
                <div class="card d-inline-block bg-secondary text-light p-2">${msg}</div>
                <div class="small">${formated}</div>
            </div>
        </div>`;
        $("#chatbox").html(newhtml);
    };

    $(".inboxmessage").click(function(){
        selecteduser = $(this).attr("id");
        console.log(selecteduser);
    });

    socket.on("message", msg => {
        inputMessage(msg);
        document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
    })

    $("#sendbtn").click(function(){
        let msg = {sender: $("#sender").html(), reciever: $("#reciever").html(), text: $("#msg").val()};
        socket.emit("chatMessage", msg);
        socket.emit("sendMessage", msg);
        outputMessage(msg.text);
        document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
        $("#msg").val("");
        $("#msg").focus();
    });
});