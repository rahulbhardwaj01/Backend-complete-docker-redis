import { Todo } from "../models/todo.js";

export const todo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newTodo = new Todo({
      title,
      description,
    });

    await newTodo.save();
    res
      .status(201)
      .json({
        success: true,
        data: {
          id: newTodo._id,
          title: newTodo.title,
          description: newTodo.description,
        },
        message: "Todo created successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({ success: true, data: todos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateTodo = async (req, res) => {
    try {
        const {id} = req.query;
        const {title, description} = req.body;
        const todo = await Todo.findById(id);

        if(!todo){
            return res.status(404).json({success:false, message: "Todo not found"});
        };
        
        todo.title = title || todo.title;
        todo.description = description || todo.description;
        await todo.save();
        res.status(200).json({success:true, data: todo, message: "Todo updated successfully"});

    } catch (error) {
         console.log(error);
         res
           .status(500)
           .json({ success: false, message: "Internal server error" });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const {id} = req.query;
        const todo = await Todo.findByIdAndDelete(id);   
        if(!todo){
            return res.status(404).json({success:false, message: "Todo not found"});
        };
        res.status(200).json({success:true, message: "Todo deleted successfully"});
    }
    catch (error) {
            console.log(error);
            res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
        
};

