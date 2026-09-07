@extends('layout.master')
@section('content')
<h1 style="text-align:center;">Welcom to Home Pages</h1>
   <div class="form">
    <form action="/save" method="POST" style="border:solid red 2px;">
        @csrf
      <div class="input">
        <lable>Note</lable>
        <input type="text" name="note"  @if($note) value="{{$note->note}}"  @endif>
        @error('note')
         <p>{{$message}}</p>
        @enderror
      </div>
      <div class="button">
        <input type="submit" value="Save">
      </div>
    </form>
    <table>
        <thead >
            <tr>
                <th>id</th>
                <th>Note</th>
                <th>Action</th>
                
            </tr>
        </thead>
        <tbody class="tbody" style=" border:solid 4px green;  ">
            @foreach($notes as $notes)
            <tr style="border: solid 2px block;">
                <td>{{$notes->id}}</td>
                <td>{{$notes->note}}</td>
                <td class="button"><a href="">Delete</a>|<a   href="{{route('edit',['id'=>$notes->id])}}">Edit</a></td>
            </tr>
            @endforeach
        </tbody>
    </table>
   </div>
   <style>
    .Edit{
        background-color: green;
    }
    .tbody{
    align-items: center;
    }
    .tbody tr{
        border:solid 2px block;
    }
    .form tbody tr {
        text-align: center;
        align-items: center;
        
    }
    .button{
        text-algin: center;

    }
    .form tr{
        margin-left: 40px;

    }
     .form tr td a{
        text-align: center;
        align-items: center;
        list-style: none;
        text-align: center;
        padding: 10px;
        
        
    }
     .form td a {
        background-color: red;
        color: #ffff;
        max-width: 10px;
        max-height: 20px;
        border-radius: 10px;
        text-align: center;
    }
    .form{
        border: 10px solid red;
        background-color: #fa4a94;

    }
    .input{
        text-align: center;
        margin-top: 20px;
         
    }
    .input input{
      border-radius: 10px;
      width: 200px;
      height: 20px;
      
    }
    .button{
        text-align: center;
        margin-top: 10px;
        padding: 10px;
    }
    .button input{
        width: 70px;
        padding: 10px;
        background-color:blue;
        border-radius: 20px;
        color: #fff;
    }
   </style>
@endsection

