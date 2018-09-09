<?php

include('database.php');

$search = $_POST['search'];
if(!empty($search)) {//si el valor no esta vacio
  $query = "SELECT * FROM task WHERE name LIKE '$search%'";
  $result = mysqli_query($connection, $query);
  
  if(!$result) {
    die('Query Error' . mysqli_error($connection));
  }
  
  $json = array();
  while($row = mysqli_fetch_array($result)) {
    $json[] = array(
      'name' => $row['name'],
      'description' => $row['description'],
      'id' => $row['id']
    );
  }
  $jsonstring = json_encode($json);//asi lo convierto en un string en jquery con parse lo convierte en json
  echo $jsonstring;
}

?>
