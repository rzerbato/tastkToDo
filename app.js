require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, 
        pausa, 
        leerInput, 
        listadoTareasBorrar, 
        confirmar,
        mostrarListadoChecklist
     } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');


const main = async() => {

    
    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();
    if( tareasDB ) {
        //Creo el listado a partir de la DB
        tareas.cargarTareasFromArray(tareasDB);
    }
    

    do {
        opt = await inquirerMenu();
        
        switch(opt){
            case '1':
                //Crear Tarea
                const desc = await leerInput('Descipción: ');
                tareas.crearTarea( desc );
                break;
            case '2':
                //Listar Tareas
                tareas.listadoCompleto();
                break;
            case '3':
                //Listar Tareas
                tareas.listarPendientesCompletadas(true);
                break;
            case '4':
                //Listar Tareas
                tareas.listarPendientesCompletadas(false);
                break;
            case '5':
                //Completado o pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
                break;
            case '6':
                //Borrar Tarea
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if( id !== 0){
                    const ok = await confirmar('Estás seguro?');
                    if ( ok ){
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada... ');
                    }
                }
                break;
        }

        guardarDB( tareas.listadoArr );

        await pausa();

    } while (opt !== '0');
}

main();