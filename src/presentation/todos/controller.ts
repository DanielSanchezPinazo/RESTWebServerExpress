
import { Request, Response } from "express";
import { prisma } from "../../data/postgres";


const todos = [
    {id: 1, text: "Buy milk", completedAt: new Date() },
    {id: 2, text: "Buy bread", completedAt: null },
    {id: 3, text: "Buy beer", completedAt: new Date() },
];

export class TodosController {

    //* dependency injection
    constructor(  ) {}

    public getTodos = ( req: Request, res: Response ) => {

/*return opcional*/res.json( todos );
    };

    public getTodoById = ( req: Request, res: Response ) => {

        const id = +req.params.id; //* ese + convierte el string en un number
        if (isNaN( id )) {
            return res.status(400).json({ error: `ID argument is not a number.` });
        };
        const todo = todos.find( todo => todo.id === id );
        ( todo )
            ? res.json( todo )
            : res.status(404).json({ error: `TODO with id ${ id } not found.` });
    };

    public createTodo = ( req: Request, res: Response ) => {

        const { text } = req.body;
        if ( !text ) return res.status(400).json({ error: `Text property is required.` });

        prisma.todo.create({
            data: { text }
            // esto es lo mismo que data: { text: text }
        });

        const newTodo = {
            id: todos[todos.length - 1].id + 1,
            text: text,
            completedAt: null
        };
        todos.push( newTodo );
        res.json( newTodo );
    };

    public updateTodo = ( req: Request, res: Response ) => {

        const id = +req.params.id;
        if (isNaN( id )) {
            return res.status(400).json({ error: `ID argument is not a number.` });
        };

        const todo = todos.find( todo => todo.id === id );
        if ( !todo ) {
            return res.status(404).json({ error: `TODO with id ${ id } not found.` });
        };

        const { text, completedAt } = req.body;

        todo.text = text || todo.text; 
        ( completedAt === "null" || !completedAt )
            ? todo.completedAt = null
            : todo.completedAt = new Date( completedAt || todo.completedAt );

        //! OJO, se pasa por referencia deberia ser 
        //* todos.forEach( ( todo, index ) => {
        //*     if ( todo.id === id ) {
        //*         todos[ index ] = todo;
        //*     };
        //* });
        res.json( todo );
    };


    public deleteTodo = ( req: Request, res: Response ) => {

        const id = +req.params.id;
        if (isNaN( id )) {
            return res.status(400).json({ error: `ID argument is not a number.` });
        };

        const todo = todos.find( todo => todo.id === id );
        if ( !todo ) {
            return res.status(404).json({ error: `TODO with id ${ id } not found.` });
        };

        res.json( todo );

        todos.splice( todos.indexOf( todo ), 1 );
    };
}



