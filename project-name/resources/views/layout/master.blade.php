<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  
  
    <link rel="stylesheet" herf="css/style.css">
</head>
<body>
    <div class="nav" style="list-style:none; background-color:red;display: block; margin: 10px; border-radius: 10px; color:blue;  ">
        <ul>
            <a href= "/" style="margin: 10px;">Home</a>
            <a href="/about" style="margin: 10px;">About</a>
            <a href="/contect" style="margin: 10px">Contect</a>
        </ul>
    </div>
    
    @yield('content')
</body>
</html>