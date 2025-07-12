# Documentacion Backend

## Endpoints

### Obtener TODOs

- Path : "/todos"
- Metodo : GET
- Input : Query Parameter("estado") = 0 o 1
- Output

``` json
[
    { "id" : 1, "descripcion" : "desc de todo 1" },
    { "id" : 2, "descripcion" : "desc de todo 2" },
]
```

### Obtener TODO

- Path : "/todos"
- Metodo : GET
- Input : "/:id" : Id del TODO.
- Output


``` json
    { "id" : 1, "descripcion" : "desc de todo 1" }
```

### Registrar TODO

- Path : "/todos"
- Metodo : POST
- Input : 

```json
{
    "descripcion" : "bla bla bla"
}
```

- Output

```json
{
    "msg" : ""
}
```

### Modificar TODO

- Path : "/todos"
- Metodo : PUT
- Input : 

```json

Path Pameter: /todos/2
{
    "descripcion" : "nuevo todo"
}
```

- Output :

```json
{
    "msg" : ""
}
```

### Eliminar TODO

- Path : "/todos"
- Metodo : DELETE
- Input :

Path Parameter: "/todos/2"

- Output :

```json
{
    "msg" : ""
}
```