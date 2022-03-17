# .NET 5 TEORÍA


## CONFIGURAR VSCODE PARA C#

1. Instalar extensión C#
2. Instalar extensión C# Extensions (la de JosKerativ)
3. Instalar la extensión NuGet Gallery (pcislo)

### Nuget Gallery

CTRL + SHIFT + P: Open Nuget Gallery


## INICIAR APLICACIÓN

### COMANDOS CONSOLA

```bash
dotnet --info
```
Comando para ver las versión de .NET que tienes instalada en el pc.

```bash
dotnet -h
```
Comando para ver la ayuda de los comandos del CLI: También se puede acceder a la ayuda de cada comando específico, por ejemplo:

```bash
dotnet new -h
```

```bash
dotnet dev-certs https --trust
```
Genera un certificado para que los navegadores puedan correr las aplicaciones .NET

```bash
dotnet run
```
Ejecuta la aplicación

```bash
dotnet watch run
```
Ejecuta la aplicación y se reinicia automáticamente cuando hacemos algún cambio en la misma.

## CREAR APLICACIÓN

1.  Creamos un **Solution File**, que es un contenedor del proyecto, y nos permitirá abrir el mismo en IDEs como Visual Studio.

```bash
dotnet new sln
```

2. Se crea un **ASP.NET Core Web API**

```bash
dotnet new webapi -o NombreAPI
```

El comando -o crea una carpeta con ese nombre en el que se incluye la estructura del proyecto.

3. Agregar el API al **Solution file**: 

```bash
dotnet sln add nombreAPI
```

## FICHEROS DEL PROYECTO DE LA API

### Controladores:

Proporcionan los endpoints de la aplicación.

```csharp
namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    { }
```

Las líneas ```[ApiController] ``` y ```[Route("[controller]")]``` Indican que la clase es un controlador, por lo que su ruta será la primera parte del nombre de la clase: ```public WeatherForecastController()```  (https://localhost:5001/weatherforecast) en este caso.

### Opciones de arranque de la API

#### Program.cs

Todas las aplicaciones .NET tienen una clase Program.cs, y dentro de ésta está el método ```Main(string[] args)```, que es el primer método que se ejecuta al iniciar la aplicación, y donde se carga la configuración que se ha definido (llamando a la clase ```Startup.cs```).

#### Startup.cs

En este fichero se inyecta la configuración.

Esta clase contiene dos métodos:

```csharp
public void ConfigureServices(IServiceCollection services) {}
```
Éste método es nuestro contenedor de inyección de dependencias. 

Si queremos que una clase o servicio esté disponible para otras áreas de la aplicación, la agregamos aquí y .NET Core se encargará de la creación y destrucción de estas clases cuando ya no necesiten ser usadas.

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
        }

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
```
Se usa para configurar el pipeline de las peticiones HTTP cuando realizamos una petición desde un navegador hasta el endpoint del controlador.

La solicitud pasa por una serie de middlewares tanto de entrada como de salida.

### Ficheros de configuración

#### appsettings.json

Nos permite establecer las variables de ejecución de nuestra aplicación:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
```

Puede estar todo en un fichero o se puede dividir por entornos con la siguiente nomenclatura:

**appsettings.Development.json** para el entorno de desarrollo o **appsettings.Production.json** para producción.

Es recomendable cambiar la línea ```"Microsoft": "Warning",``` a ```"Microsoft": "Information",``` en el entorno de desarrollo para tener información más detallada en los logs. 

#### launchSettings.json

Cuando arrancamos la aplicación, el programa comprueba el parámetro ```"API":``` del fichero para ver qué tiene que utilizar cuando se inicia.

En este parámetro podemos ver el entorno en el que estamos, la URL donde se ejecutará la API y varias cosas más.

## ENTIDADES

Una entidad  es una abstracción de algo físico (por ejemplo un usuario). Serán nuestras clases de Dominio.

```csharp
public int Id { get; set; }
```
Establece la propiedad Id para la clase AppUser. En este caso por convención, a la hora de crear automáticamente la BBDD a partir de las entidades de nuestra API, si se encuentra con un campo Id, automáticamente lo creará como clave principal, y al ser de tipo int lo hará autoincremental.

```csharp
public string Username { get; set; }
```

Por convenciones no es recomendable llamar a este campo UserName ya que esta variable la usa Identities.

## ENTITY FRAMEWORK

- Es un ORM (Object Relational Mapper)
- Traduce nuestro código en sentencias SQL que actualizan las tables de la BBDD.

### DbContext

- Actúa como un puente entre nuestras entidades y la Base de Datos.
- Es la clase principal que usaremos para las interacciones con la BBDD.

### Proveedores de Bases de Datos

- Entity framework funciona con proveedores de Bases de Datos (SQLite, SQL Server...).
- Un proveedor de Base de Datos es responsable de traducir la query de Linq en una sentencia de SQL.

### Características de Entity Framework

- Nos permite ejecutar queries hacia nuestra BBDD usando Linq
- Registro de cambios: Mantiene un registro de cambios en nuestras entidades que tienen que ser enviados a la BBDD.
- Nos permite guardar la BBDD y ejecutar sentencias INSERT y Delete. La clase DbContext nos proporciona un método ```saveChanges()``` para ello.
- Concurrencia: Proteje contra sobreescritura de datos por parte de otros usuarios cuando los datos se extraen de la BBDD.
- Transacciones: Gestión automática de transacciones cuando se hacen consultas.
- Incluye una caché de primer nivel, por lo que las queries repetidas extraerán los datos de la caché en vez de la BBDD.
- Convenciones integradas: Incluye una serie de reglas que automaticamente configuran el esquema de Entity Framework o el modelo que usamos para crear la BBDD.
- Configuración: Podemos configurar nuestras entidades, pudiendo anular las convenciones predeterminadas.
- Migraciones: Crea un esquema de BBDD para que cuando iniciamos nuestra aplicación o ejecutamos un comando particular, generemos automáticamente nuestra base de datos en el servidor de BBDD.

## Agregar Entity Framework al proyecto

### Agregar Entity Framework al proyecto

- Hay que instalar el paquete del proveedor de la BBDD: Microsoft.EntityFrameworkCore.ProveedorBBDD

- Una vez instalado en el fichero API.csProj se pueden ver todos los paquetes que hay en el proyecto.

### Crear la clase para el DbContext

Se recomienda crear una carpeta aparte en el proyecto para las clases de datos.

```csharp
namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<AppUser> Users { get; set; }
    }
}
```

```csharp
namespace API.Data
```
El namespace se puede cambiar sin problema, en este caso indica la ruta donde está la clase (En la carpeta Data que está dentro de API).

```csharp
public class DataContext : DbContext { }
```

Podemos llamar a la clase como queramos, pero tiene que ser de tipo DbContext (se importa de Microsoft.EntityFrameworkCore)

```csharp
public DataContext(DbContextOptions options) : base(options) { }
```
Constructor con los parámetros que recibirá.

```csharp
public DbSet<AppUser> Users { get; set; }
```

Se crea una propiedad por cada tabla de la BBDD (de tipo DbSet).

Una vez creada, hay que crear la dependencia en el fichero Startup.cs para que pueda ser usada por otras partes de la aplicación, para ello hay que poner el siguiente comando en el método ```ConfigureServices()```

```csharp
services.AddDbContext<DataContext>(options => {
    options.UseSqlite("Connection String");
});
```

### Cambiar acceso a la configuración

Hay que cambiar la propiedad configuration y el constructor por lo siguiente: 

```csharp
private readonly IConfiguration _config;

public Startup(IConfiguration config)
{
    _config = config;
}
```
En este caso cambiamos el acceso a privado y el nombre del campo configuration se cambia por _config. El _ delante del nombre de la variable indica que es una variable privada (buena práctica).

Para que VS Code cree los campos automáticamente siguiendo esta premisa (quitar la palabra this del constructor y asignar _ delante del nombre de una variable privada), se pueden cambiar los siguientes ajustes:

```json
"csharpextensions.privateMemberPrefix": "_",
"csharpextensions.useThisForCtorAssignments": false
```

### Crear cadena de conexión

1. En desarrollo, si se trabaja con datos que no son privados, se puede agregar la cadena de conexión en el fichero **appsettings.Development.json**: 

    En el ejemplo se crea una cadena de conexión para un fichero de SQLite:

    ```json
    "ConnectionStrings": {
        "DefaultConnection": "Data source=datingapp.db"
    },
    ```
2. En el método ```ConfigureServices()``` del fichero Startup, donde generábamos la cadena de conexión, hay que agregar las siguientes líneas:

    ```csharp
    services.AddDbContext<DataContext>(options => {
        options.UseSqlite(_config.GetConnectionString("DefaultConnection"));
    });
    ```

### Crear las migraciones

1. Hay que instalar el paquete dotnet-ef de la siguiente dirección: https://www.nuget.org/
    
    - Buscamos el paquete dotnet-ef y buscamos la versión que coincida con la versión de EF.
    - Copiamos el comando que nos indica.

2. Abrimos una terminal y ejecutamos el comando que previamente hemos copiado:
    
    ```bash
    dotnet tool install --global dotnet-ef --version 5.0.15
    ```

3. Instalamos el paquete ```Microsoft.EntityFrameworkCore.Design``` desde nuget.

4. Ejecutamos el siguiente comando en la terminal:

    ```bash
    dotnet ef migrations add InitialCreate -o Data/Migrations
    ```
    - Esto nos creará la carpeta de Migrations dentro de data donde podremos ver las clases con las que se crea la BBDD.

    ### Crear la Base de datos

    1. Escribir el siguiente comando en la terminal:

        ```bash
        dotnet ef database update
        ```


## Controllers

### Crear clase Controller

Lo primero que tiene que tener una clase controller es '''[ApiController]''', que indica que la clase que lo tenga es un controlador.

Lo segundo es ```[Route("[controller]")]```, que indica el endpoint del controlador. 

La clase controller tiene que ser de tipo ControllerBase, importada de ```Microsoft.AspNetCore.Mvc```:

```csharp
    public class UsersController : ControllerBase { }
```

El nombre del controlador es recomendable que sea el mismo nombre que la tabla de la BBDD a la que va a gestionar más el nombre Controller.

Por ejemplo, un controlador de la tabla **Users** será **UsersController**.

### Acceder a la BBDD a través del controlador.

Inyectamos la dependencia DataContext en la clase para poder acceder a la BBDD:

```csharp
    private readonly DataContext _context;

    public UsersController(DataContext context)
    {
        _context = context;
    }
```

### GET

```csharp
    [HttpGet]
    public ActionResult<IEnumerable<AppUser>> GetUsers() { }
```

```[HttpGet]``` nos indica que el método va a ser un endpoint get, en el que podremos desde el cliente coger los datos que le solicitemos.

```csharp
public ActionResult<IEnumerable<AppUser>> GetUsers() { }
```

- ```ActionResult<IEnumerable<AppUser>>```: Indica el tipo de datos que va a devolver el método.

- ```IEnumerable<AppUser>```: Permite iterar sobre la colección.

- Endpoints con parámetros:
    ```csharp
    [HttpGet("{id}")]
    ```

## Agregar CORS

En el fichero startup.cs hay que agregar la siguiente línea en el método ```ConfigureServices()```

```csharp
services.AddCors();
```

En este método el orden no es importante, por lo que se puede poner esa línea antes o después de cualquier otro servicio.

También hay que escribir la siguiente línea en el método ```Configure()```

```csharp
app.UseCors(policy => policy.AllowAnyMethod().WithOrigins("http://localhost:4200"));
```

En este caso, sí que es importante el orden en el que se usa el servicio, ya que tiene que estar después del routing, y antes que la authentication.