<?php

namespace App\Http\Controllers;
use App\Models\Note;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(){
        return view ('Home')
        ->with('notes',Note::all());
    }


    public function save(Request $request){
     $request->validate([
        'note' =>'required'
     ]);
     


    Note::create(['note'=>$request->note]);
     return redirect()->back();
    }
    public function edit($id){
       $note= Note::find($id);
       return view('Home')
       ->with('notes',Note::all())
       -> with('note',$note);
    }
}
