$(document).ready(function() {//al cargar la paina
   // Global Settings
  let edit = false;//esto es para que se edite alguna tarea, pero si esta en false solo va a servir para guradar, cuando este se true va a llevar los datos a otro archivo php

   // Testing Jquery
  console.log('jquery esta funcionando!');//es para saber que el jquety funciona bien 
  
  $('#task-result').hide();//esto mantiene oculto los resultados de la busqueda

  fetchTasks();//esto llama a la funcion que actualiza los datos si refrescar la pagina

  // search key type event
  $('#search').keyup(function(e) {//al marcar alguna tecla sobre el buscador activa esta funcion
    if($('#search').val()) {//si ingresa algun valor entonces as lo siguiente
      let search = $('#search').val();//guarda ese valor en una variable
      //console.log(search);
      $.ajax({//activamos el evento ajax
        url: 'task-search.php',//el primer parametro es el archivo al cual vamos a consumir
        data: {search},//le mando los datos de variable normalmente era {search:search} pero en jquery 3 simplemente {search} ya sbre entiende
        type: 'POST',//el tipo o metodo es post
        success: function (response) {//si el preceso es exitoso guardo en esta funcion las respuesta de dicho archivo
            let tasks = JSON.parse(response);//convierto el string recibido en json y lo guardo en una variable
            let template = '';//creo una variable vacia
            tasks.forEach(task => {//posiblemente retorne varios resultados asi que uso un siclo forEach el cual antes ser nombrado recibe el parametro al cual se va repetir asta agotar su existencia luego llama a una funcion, esta funcion es igual que si yo coloco function(task){}, sobre entiende que es una función,(task) => {} o task => {}, sin los parentesis por lo que vi funciona tambien asi como esta aqui
              template += `
                <tr taskId="${task.id}">
                  <td> ${task.id} </td>
                  <td> 
                    ${task.name}  
                  </td>
                  <td> ${task.description} </td>
                  <td>
                    <button class="task-delete btn btn-danger">
                      Delete 
                    </button>
                  </td>
                  <td>
                    <button class="task-item  btn btn-success">
                      Edit
                    </button>
                  </td>
                </tr>
              ` //llenamos la variable template
            });
            
            $('#container').html(template);//colocamos todo lo guardo dentro del campo el cual recibe el id de container
            $('#task-result').show();//esto es para que aparesca ya que fuera de la funcion le pedi que ocultara este campo
        } 
      })
    }
  });

  //event submit
  $('#task-form').submit(function(e){//que al hacer submit del formulario al cual pertenece este id #task-form as esto
    const postData = {//guardamos dentro de un objeto las datos obtenidos
      name: $('#name').val(),
      description: $('#description').val(),
      id: $('#taskId').val()//este solo la a va recibir la de editar, la de guardar no por que esta manda al mysql el cual esta en autoincremnte primary
    };
    
    const url = edit === false ? 'task-add.php' : 'task-edit.php';//si la variable edit sigue en false entonces la url sera la de guardar datos, si esta es true es por que mas abajo se conviertio en true por tando la url sera la de editar
    console.log(postData, url);//es para ver los datos a enviar mas la url de donde se enviaran

    $.post(url, postData,function(response){// envio los datos a la url la cual se haiga elegido arribita, los datos que estan abajito del submit posData y la funcion con los datos es solo para ver en la consola
      console.log(response)
      fetchTasks();//esta es la funcion que acyuliza los dato si refrescar
      $('#task-form').trigger('reset');//con esto le digo que al submit me limpie los datos de los campos
    });
    
    e.preventDefault();//esto es para que no se refresque la pagina ya que al hacer submit esta se refresaca, eso es lo que se previene con esta funcion
  });

  // Fetching Tasks
  //esta funcion siempre va a retornar la lista actualizada, ya que esta conectada al archivo que recibe los datos del mysql, dicho archivo retorna la lista a como esta en el mysql
  function fetchTasks() {//esta es la funcion que actualiza los datos
    $.ajax({
      url: 'task-list.php',//este archivo se encarga de enviar la lista.
      type: 'GET',//como esta por get es que voy a recibir datos
      success: function (response) {//en response esta los datos obtenidos, aqui es los mismo que search
        //console.log(response);
        let tasks = JSON.parse(response);
        let template = '';
        tasks.forEach(task => {
          template += `
            <tr taskId="${task.id}">
              <td> ${task.id} </td>
              <td> 
                ${task.name}  
              </td>
              <td> ${task.description} </td>
              <td>
                <button class="task-delete btn btn-danger">
                  Delete 
                </button>
              </td>
              <td>
                <button class="task-item  btn btn-success">
                  Edit
                </button>
              </td>
            </tr>
          `//con la execcion de que viene con mas datos y con los botones
        });
        $('#tasks').html(template);//coloco los datos en este campo
      }
    })
  };
//on y el [0]
  // Delete a Single Task
  $(document).on('click', '.task-delete', function() {
    if(confirm('Are you sure you want to delete it?')) {//es un mensaje de confirmacion, si el cliente da en aceptar se sobre entiende que es true por tanto se da la condicion
      //console.log($(this));// aqui me dice que esta en la poscion 0, al yo colocar console.log($(this)[0]) me retorna el boton asi:<button class="task-delete btn btn-danger">, mejor dicho me situo sobre este elemento y si coloco: console.log($(this)[1]) retorna undefined osea que no esta definido, como es un arreglo segun, se seleciona el primero y unico elemento que tiene este boton con [0]
      let element = $(this)[0].parentElement.parentElement;//al hacer click sobre dicho elemeneto, primero que todo va a buscar la primera posicion pero no va a estar en el id que lo que se necesita por eso debemos subir de padre en padre con parentElement asta llegar a el tr de este elemento en el cual se coloco el id  
      console.log(element);// para ver el dato
      let id = $(element).attr('taskId');//como de la varible element optengo el tr con todo yo solo quiero el valor del atributo  taskId el cual es el id
      $.post('task-delete.php', {id}, function (response) {//envio los datos 
        //console.log(response);
        fetchTasks();//actualiza
      });
    }  
  })

    // Get a Single Task by Id editar
  $(document).on('click', '.task-item', function() {//on significa.: que vamos a escuchar el evento que se llama en el primer parametro, en este caso click, el segundo parametro es en donde queremos que se escuche este este evento y el terce parametro es la funcion que se va realizar despues de activar el evento sobre sobre dicho elemeneto
    let element = $(this)[0].parentElement.parentElement;
    let id = $(element).attr('taskId');
    $.post('task-single.php', {id}, function(response) {//envio el id y retorna los datos del el registro de ese id
      console.log(response);
      const task = JSON.parse(response);//viene en string, lo convierto en json
      $('#name').val(task.name);//asi relleno los campos con las datos optenidos
      $('#description').val(task.description);
      $('#taskId').val(task.id);//este no se ve pero viene tambien 
      edit = true;//esta variable esta en negativa pera al dar click sobre este elemento la convierto en true para que los datos se enviados a la url o archivo el cual va hacer la actulizacion
    });
    //e.preventDefault(); no es necesario por que en submit ya lo hace
  });

});

