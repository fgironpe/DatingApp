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

***[HttpGet]*** nos indica que el método va a ser un endpoint get, en el que podremos desde el cliente coger los datos que le solicitemos.

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
app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));
```

En este caso, sí que es importante el orden en el que se usa el servicio, ya que tiene que estar después del routing, y antes que la authentication.

## Cambios en las entidades

Si se realiza un cambio en cualquier entidad, hay que actualizar la migración y volver a crear la base de datos con los nuevos cambios que se han realizado.

Para ello habría que escribir los siguientes comandos en la terminal:

```bash
dotnet ef migrations add UserPasswordAdded
```
Actualiza las migraciones que se encuentran en la carpeta Migrations del proyecto.
Donde después de add, iría una descripción de lo que se ha modificado

```bash
dotnet ef database update
```
Actualiza la BBDD con los nuevos datos que se han introducido en la migración.

## DTO (Data Transfer Object)

## JSON Web Tokens (JWT)

Una API no es algo con lo que mantenemos una sesión, hacemos una petición y el API responde y la relación se acaba hasta que se hace una nueva petición.

Los tokens son buenos para usar con una API porque son lo suficientemente ligeros como para enviarlos en cada petición.

- Son un standard de la industria para tokens (RFC 7519)
- Son autónomos y pueden contener:
    - Credenciales
    - Peticiones
    - Otra información

### Estructura

Un JWT se divide en 3 partes, cada parte se separa con un .:

1. Cabecera: Contiene el algoritmo y el tipo de token que es:
        - El algoritmo es lo que se usa para encriptar la firma en la tercera parte del token.
        - El tipo de token que es (JWT en este caso).

    ```json
    {
        "alg": "HS512",
        "typ": "JWT"
    }
    ``` 

2. Payload: Puede contener información sobre nuestras peticiones y nuestas credenciales, por lo que podemos tener cosas como el identificador, el nombre de usuario, qué roles de usuario tiene o cualquier otra petición.
    - nbf: (Timestamp): Significa que el token no podrá ser usado antes de una fecha y hora determinadas.
    - exp: (Timestamp) - Expidity Date: Fecha de caducidad del token.
    - iat:  (TImestamp) - Issued At: Fecha de emisión del token.

    ```json
    {
        "nameId": "lola",
        "role": "Member",
        "nbf": 1599297240,
        "exp": 1599297240,
        "iat": 1599297240
    }
    ``` 

3. Contiene la firma encriptada del token. La firma es encriptada por el servidor usando una clave segura y nunca abandona el servidor.

La única parte que está encriptada en un token es la tercera, todos los demás datos son fáciles de acceder a ellos, pero lo que no es fácil es modificar el token de ninguna manera y esperar que el API lo valide, porque cualquier modificación cambiará la estructura del token y su firma no podrá ser verificada.

### Funcionamiento de la autenticación por token.

1. El usuario se logea y manda la información del nombre y la contraseña al servidor.

2. El servidor validará las credenciales y devolverá un JWT que el cliente guardará en el local storage del navegador.

3. Se enviará el JWT en cada petición.
    - Cada vez que queramos acceder a algo que está protegido por autenticación en el servidor, enviaremos el JWT con la petición.

    - Lo que se hace con el token es agregar una cabecera de autenticación a la petición y luego el servidor comprobará el token y verificará que es válido.

    - El servidor firmará el token y tendrá acceso a su clave privada que tiene almacenada.

    - El servidor podrá verificar que el token es válido sin necesidad de hacer una petición a la base de datos.

4. El servidor verifica el JWT y envía una respuesta.

### Beneficios del JWT

1. No hay que administrar sesiones. Los JWT son tokens autónomos:
    
    - Sólo tenemos que enviar el token con cada petición, y como es muy ligero no agrega mucho tamaño a nuestra petición.

2. Portable: Un token puede ser usado por muchos backends: 
    
    - Mientras que todos los backends compartan la misma firma y la misma clave secreta, podrán verificar que el token es válido.
    
3. No se requieren cookies, por lo que es apto para móviles:

4. Rendimiento: 
    
    - Una vez son creados, no hay necesidad de hacer peticiones a la base de datos, por lo que cuando un usuario de logea, le emitimos un token.

### Agregar JWT a la API

- Para seguir el principio de responsabilidad única, crearemos un servicio que se encargue de administrar los JWT. Lo que hará será recibir un usuario y creará un token para el usuario y lo devolverá al controlador.

    Para ello crearemos una **interfaz** (como conveniencia, los nombres de la interfaz es recomendable que empiecen por I).

    Una interfaz es una especie de contrato entre ella misma y los elementos que la usen. 

    Este contrato estipula que cualquier clase que use esta interfaz, también tiene que usar sus propiedades, métodos y / o eventos.

    La razón para crear interfaces asociadas a servicios es por el testing, ya que es más fácil mockear la interfaz para hacer pruebas con ella.

    Una interfaz no contiene lógica de implementación, solo contiene la firma de las funcionalidades que proporciona: 

    ```csharp
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }

    ``` 

- Una vez creada la interfaz, se creará un servicio que dependerá de ésta, y que usará sus métodos como ya hemos visto antes:

    ```csharp
    public class TokenService: ITokenService
    {
        public string CreateToken(AppUser user)
        {
            // lógica
        }
    }

    ``` 

- Después hay que agregar una dependencia del servicio en el método ```ConfigureServices()``` de la clase startup.cs:

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddScoped<ITokenServiceInterface, TokenService>();
    }
    ```
    Cuando inyectamos un servicio en el método ```ConfigureServices()``` hay que especificar el ciclo de vida que tendrá este servicio.

    En este caso ```AddScoped<>()``` nos indica que su ciclo de vida será el mismo que el de la petición Http que tendrá lugar cuando se llame a este servicio, por lo que una vez finalizada el servicio se cerrará, liberando los recursos. 

    ```csharp
    services.AddScoped<ITokenServiceInterface, TokenService>();
    ```

### Creación del token

- Descargamos el siguiente paquete nuget: System.IdentityMOdel.Tokens.Jwt y lo instalamos.

- Creamos un constructor en nuestro servicio y le inyectamos la dependencia IConfiguration de ***Microsoft.Extensions.Configuration***:

    ```csharp
    public TokenService(IConfiguration config) { }
    ```

- Creamos un nuevo campo de tipo ***SymmetricSecurityKey*** que se importa de ***Microsoft.IdentityModel.Tokens***:

    ```csharp
    private readonly SymmetricSecurityKey _key;
    ```

    - La encriptación simétrica es tipo de encriptación donde una clave se encarga de encriptar y desencriptar información electrónica. Por lo que la misma clave se encarga de firmar un Jwt y de verificar la firma. 

    - Otro tipo de encriptación es la asimétrica, donde un par de claves (pública y privada), se usan para encriptar y desencriptar mensajes.
        Así es como funcionan Https y SSL.

- Dentro del constructor tenemos que definir nuestra clave:

    ```csharp
    public TokenService(IConfiguration config) 
    { 
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
    }
    ```

- Implementamos la lógica para crear el token dentro del método ```CreateToken(AppUser user)```:

    - Empezamos identificando qué aserciones (claims), van a ir dentro del token. En este caso irá el nombre de usuario:

        ```csharp
        // Imports para JwtRegisteredClaimNames
        using System.IdentityModel.Tokens.Jwt;

        public string CreateToken(AppUser user)
        { 
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
            };
        }
        ```

    - Creamos las credenciales:

        ```csharp
        public string CreateToken(AppUser user)
        { 
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
        }
        ```

    - Creamos una descripción del token:

        ```csharp
        // Imports para DateTime
        using System;

        public string CreateToken(AppUser user)
        { 
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // Agregamos las aserciones
                Subject = new ClaimsIdentity(claims),
                // Definimos una fecha de caducidad
                Expires = DateTime.Now.AddDays(7),
                // Agregamos las credenciales
                SigningCredentials = creds
            };
        }
        ```

    - Creamos un TokenHandler que se encargará de crear el token con la estructura que hemos definido en los pasos previos:

        
        ```csharp
        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);
        ```

    - Y por último devolvemos el token generado:

        ```csharp
        return tokenHandler.WriteToken(token);
        ```

    Por lo que el método ```CreateToken()``` quedaría de la siguiente manera: 

    ```csharp
        public string CreateToken(AppUser user)
        {
            // Creamos las aserciones (claims):
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
            };

            // Creamos las credenciales (pasamos como parámetro la key y el tipo de encriptación de lafirma)
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            // Descripción del token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            // TokenHandler
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    ```

### Usando el token generado

- Creamos un DTO para indicar lo que nos devolverá el API una vez se haya registrado o autenticado correctamente un usuario, usando el token para ello:

    ```csharp
        public class UserDto
        {
            public string Username { get; set; }
            public string Token { get; set; }
        }
    ```

    Le asignamos dos propiedades, el token asociado a ese usuario y el nombre de usuario que necesitamos para crear el token y que va dentro del payload.

- En AccountController tenremos que cambiar los métodos de ```Login()``` y ```Register()``` para que hagan uso del nuevo DTO, para ello tendremos que cambiar el tipo de return del método y el propio return generando un nuevo UserDto:

        ```csharp
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto) 
        {
            // lógica

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }
    ```

- Definimos la clave secreta en appsettings.Development.json (sólo para el entorno de desarrollo):

    ```json
        "TokenKey": "super secret unguessable key",
    ```

### Agregar autenticación y autorización al proyecto

#### Atributos en controlador

Para agregar autenticación o autorización a un endpoint, hay que agregar estos atributos a los métodos que queramos que lo requieran:

``` [AllowAnonymous]``` permite que cualquier cliente pueda hacer la petición.
```[Authorize]``` necesitará de un método de autorización para poder realizar la petición, en este caso un JWT.

```csharp
    // Import para [Authorize]
    using Microsoft.AspNetCore.Authorization;

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {
        return await _context.Users.FindAsync(id);
    }
```

#### Agregar Middleware de autorización

- En el Nuget Gallery hay que descargar el siguiente paquete: ***Microsoft.AspNetCore.Authentication.JwtBearer***. Hay que instalar la versión que coincida con la versión de .NET que tengamos.

- Agregar el servicio en el fichero ***startup.cs***:

    - En el método ConfigureServices():

        - Agregar la autenticación: ```services.AddAuthentication()```
      
        - Elegir el método de autenticación: ```services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)```
       
        - Agregar configuración: 
           
            ```csharp
                services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        // Validamos la firma del servidor
                        ValidateIssuerSigningKey = true,
                        // Agregamos la firma del servidor
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"])),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
            ```

    - En el método Configure():
        ```app.UseAuthentication();``` Tiene que ir entre el CORS y la Autorización.

## Extension methods

Los extension methods nos permiten agregar métodos a tipos existentes sin necesidad de crear un nuevo tipo derivado de éste o modificarlo.

Esto nos permitirá no repetir código y poder usar este método en varias clases que lo requieran.

### Crear un Método Extendido

- Tenemos que crear una clase estática con un método que nos devuelva los servicios que queramos exportar (fijarse bien los parámetros que tienen los servicios para inyectarlos en el constructor del método):

    ```csharp
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddScoped<ITokenService, TokenService>();
            
            services.AddDbContext<DataContext>(options => {
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
    }
    ```

    En este caso estamos exportando los servicios de la base de datos y el JWT (ApplicationServices), del método ConfigureServices() del fichero Startup.cs:

    ```csharp
    public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<ITokenService, TokenService>();
            
            services.AddDbContext<DataContext>(options => {
                options.UseSqlite(_config.GetConnectionString("DefaultConnection"));
            });

            services.AddControllers();
            services.AddCors();
        }
    ```

    Si nos fijamos, éste método tiene como parámetro un IServiceCollection, que tendremos que ponerlo también en el método extendido.

    También vemos que UseSqlite usa _config, que se define en otro método del fichero Startup.cs, por lo que también habrá que pasarlo al método extendido para poder usarlo ahí.

    Una vez configurado, hay que usar el método extendido en el método que nos interesa (ConfigureServices() en este caso), sustituyendo las líneas que hemos quitado por una llamada al método extendido:

    ```csharp
    public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationServices(_config);
            // ...
        }
    ```

    ## Relaciones Entity Framework

    ### One to many

    #### Teoría

    En este caso vamos a asociar las tablas Users y Photos:

    Un usuario puede tener muchas fotos, por lo que la tabla Photos tendrá que tener como clave foránea el Id de la tabla Users.

    #### Agregar relación en el proyecto con EF por convención (método automático)

    A la hora de crear la relación, EF lo hace automáticamente, ya que dentro de la *Entidad AppUser* hay una propiedad que es una *ICollection* de *Photos*, pero dentro de la entidad Photo no hay ninguna propiedad de la tabla Users, por lo que EF automáticamente asocia una relación ***Uno a Muchos***, en este caso tampoco habría que agregar la *Entidad Photos* en el *DbContext*:

    ```csharp
    public ICollection<Photo> Photos { get; set; }
    ```

    A la hora de crear la migración donde se vea reflejada la relación hay que hacerlo con el siguiente comando:

    ```bash
    dotnet ef migrations add nombreMigracion
    ```

    Cuando creamos la migración en este caso podemos ver un par de cosas:

    - Se crea la nueva tabla Photos relacionada con la Entidad Photo (para que la tabla se llame de forma distinta a la entidad si no lo estaba previamente, se pone el atributo [Table("nombreTabla")] en la entidad).

    - Dentro de la tabla, si es la parte Muchos de la relación, se crea una columna con el Id de la parte Uno, y será un campo nullable, por lo que podrá haber fotos en nuestra base de datos que no estén asociadas a un usuario:
        ```csharp
        AppUserId = table.Column<int>(type: "INTEGER", nullable: true)
        ```
    - La columna AppUserId la crea como una clave foránea, con el tipo de borrado *ReferentialAction.Restrict*, lo que quiere decir que si borramos un usuario, no se borrarán las fotos asociadas a este.

    ### Configurar manualmente la relación

    En esta aplicación de ejemplo queremos que todas las fotos tengan que pertenecer a algún usuario, y que cuando un usuario se de de baja se borren todas sus fotos (borrado en cascada), por lo que tendremos que hacer una definición completa de la relación:

    1. Para poder establecer la relación, en la Entidad perteneciente a la parte muchos tendremos que decirle sobre la otra parte, en este caso tendremos que agregar dos propiedades nuevas en la Entidad.

        ```csharp
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
        ```

        - Esto es lo que se llama Definición completa, ya que tenemos en la *Entidad AppUser* (la parte Uno de la relación) una propiedad *ICollection* de *Photos* (un array de Photos), y dentro de la *Entidad Photo* definimos AppUser

    2. Creamos la nueva migración:

        ```bash
        dotnet ef migrations add nombreMigracion
        ```

        - A la hora de comprobar lo que ha cambiado en la migración podremos ver lo siguiente:
            ```csharp
            AppUserId = table.Column<int>(type: "INTEGER", nullable: false)
            ```
            Ahora la columna AppUserId de la tabla Photos no es nullable, por lo que todas las fotos tendrán que pertenecer a un usuario y en el apartado Constrains vemos que la columnma AppUserId se ha creado como clave foránea pero con borrado en cascada.

    3. Una vez creada la migración tendremos que actualizar la BBDD:

        ```bash
        dotnet ef database update
        ```

## Patrón Repositorio

https://dev.to/ebarrioscode/patron-repositorio-repository-pattern-y-unidad-de-trabajo-unit-of-work-en-asp-net-core-webapi-3-0-5goj

Un Repositorio media entre las capas del dominio y del mapeo de datos, actuando como una colección de objetos de dominio en memoria.

Un repositorio es una capa de abstracción. En vez de que el controlador acceda directamente al DbContext, usará un repositorio y usará los métodos que estén dentro de éste. El repositorio usará el DbContext y ejecutará la lógica dentro de éste.

### Razones para usarlo

- Encapsula la lógica dentro del DbContext donde hay miles de métodos (*Users.First()*, *Users.FirstOfDefault()*...), entonces usando un repositorio encapsulamos la lógica, y si un controlador inyecta un repositorio solo tendrá acceso a los métodos de éste (*GetUser()*, *GetAllUsers()*...).

- ***Reduce la duplicidad de la lógica de queries***: Si necesitamos acceder a un dato desde varios controladores, sólo tendremos que inyectar el repositorio encargado de esa lógica en cada uno de los controladores, en vez de escribir la misma query.

- ***Facilita el testing***: Es más fácil hacer tests a un repositorio que a un DbContext.

### Ventajas

- Minimiza la duplicidad de la lógica de queries.

- Desacopla la aplicación del framework de persistencia.

- Todas las queries a la base de datos están centralizadas y no están dispersas por toda la aplicación.

- Permite cambiar el ORM facilmente (sólo habría que modificar los repositorios).

- Facilita el testing: Es más fácil crear un Mock de una interfaz Repositorio que testear contra el DbContext.

### Desventajas

- Es una abstracción de una abstracción: Entity Framework es una abstracción de la base de datos y un repositorio es una abstracción de Entity Framework.

- Cada entidad tiene que tener su propio repositorio, lo que indica que habrá que escribir más código.

-  Necesita implementar el patrón Unidad de Trabajo para controlar las transacciones.

## Implementar el patrón repositorio en nuestra aplicación

1. Creamos una interfaz para nuestro repositorio:

    ```csharp
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SavaAllAsync();
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
    }
    ```

2. Creamos la clase de implementación que implementará la interfaz que hemos creado antes.

3. Agregamos la interfaz y la clase de implementación en el método ***ConfigureServices()*** de ***Startup.cs*** (o de nuestro método extendido si lo tenemos):

    ```csharp
    services.AddScoped<IUserRepository, UserRepository>();
    ```

4. Modificamos el controlador para poder usar el repositorio"

    - Inyectamos la interfaz del repositorio en el controlador, quitando el DbContext:
        ```csharp
        private readonly IUserRepository _userRepository;

        // Importante inyectar la interfaz en vez de la clase de implementación, ya que si no EF no va a saber crear una instancia de esta.
        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        ```


    - Modificamos los métodos para que usen los métodos del repositorio:

        ```csharp
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return Ok(await _userRepository.GetUsersAsync());
        }
        ```

## AutoMapper

https://programacion-ecuador.com/2021/04/23/iniciando-con-automapper-en-asp-net-core/