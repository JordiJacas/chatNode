var socket = io.connect('http://localhost:3000');

//al actualizar la página eliminamos la sesión del usuario de sessionStorage
$(document).ready(function()
{
    manageSessions.unset("login");
});

//función anónima donde vamos añadiendo toda la funcionalidad del chat
$(function()
{
    //si el usuario no ha iniciado sesión prevenimos que pueda acceder
    showModal("Inicio Sesión",renderForm());

    //al pulsar en el botón de Entrar 
    $("#loginBtn").on("click", function(e)
    {
        e.preventDefault();
        //en otro caso, creamos la sesión login y lanzamos el evento loginUser
        //pasando el nombre del usuario que se ha conectado
        manageSessions.set("login", $(".username").val());
        //llamamos al evento loginUser, el cuál creará un nuevo socket asociado a nuestro usuario
        socket.emit("loginUser", manageSessions.get("login"));
        //ocultamos la ventana modal
        $("#formModal").modal("hide");
    });

    //cuando se emite el evente refreshChat
    socket.on("refreshChat", function(action, message)
    {
        //simplemente mostramos el nuevo mensaje a los usuarios
        //si es una nueva conexión
        if(action == "conectado")
        {
            $("#chatMsgs").append("<p class='col-md-12 alert-succes'>" + message + "</p>");
            }
        //si es una desconexión
        else if(action == "desconectado")
        {
            $("#chatMsgs").append("<p class='col-md-12 alert-danger'>" + message + "</p>");
        }
        //si es un nuevo mensaje 
        else if(action == "msg")
        {
            $("#chatMsgs").append("<p class='col-md-12'>" + message + "</p>");
        }
    });

    //actualizamos el sidebar que contiene los usuarios conectados cuando
    socket.on("updateSidebarUsers", function(usersOnline)
    {
        //limpiamos el sidebar donde almacenamos usuarios
        $("#chatUsers").html("");
        //recorremos el objeto y los mostramos en el sidebar
        $.each(usersOnline, function(key, val)
        {
            $("#chatUsers").append("<p class='col-md-12'>" + key + "</p>");
        })
    });

    //al pulsar el botón de enviar
    $('.sendMsg').on("click", function() 
    {
        //capturamos el valor del campo de texto donde se escriben los mensajes
        var message = $(".message").val();
        //mostrará el mensaje escrito en el chat con nuestro nombre
        socket.emit("addNewMessage", message);
        //limpiamos el mensaje
        $(".message").empty();
    });
})

//funcion que recibe como parametros el titulo y el mensaje de la ventana modal
function showModal(title,message)
{   
    $("h2.title-modal").text(title).css({"text-align":"center"});
    $("p.formModal").html(message);
    $("#formModal").modal({show:true, backdrop: 'static', keyboard: true });
}

//formulario html para mostrar en la ventana modal
function renderForm()
{
    var html = "";
    html += '<div class="form-group" id="formLogin">';
    html += '<input type="text" id="username" class="form-control username" placeholder="Nombre">';
    html += '</div>';
    html += '<button type="submit" class="btn btn-primary    btn-large" id="loginBtn">Entrar</button>';
    return html;
}

var manageSessions = {
    //obtenemos una sesión //getter
    get: function(key) {
        return sessionStorage.getItem(key);
    },
    //creamos una sesión //setter
    set: function(key, val) {
        return sessionStorage.setItem(key, val);
    },
    //limpiamos una sesión
    unset: function(key) {
        return sessionStorage.removeItem(key);
    }
};