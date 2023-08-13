<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::get();

        return response()->json([
            'data'=>['tasks' => $tasks], 
            "message"=> "data retrived succesfully"
        ],200);
    }

    /**
     * storeOrupdate a newly created or update resource in storage.
     */
    public function storeOrupdate(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'id' => 'integer',
            'status' => 'required',
            'due_date' => ['required', 'date'],
        ]);

        // convert date to string
        $date = (string) $request->due_date;
        // set date format
        $date = date('Y-m-d', strtotime($date));

        // if id is not provided then create a new one, otherwise update the existing one.
        Task::updateOrCreate(
            ['id'=> $request->id ?? null],[
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'due_date' => $date,
        ]); 

        return response()->json([
            'data'=>[], 
            "message"=> "data saved succesfully"
        ],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json([
            'data'=>[],
            "message"=> "data deleted succesfully"
        ],200);
    }
}
