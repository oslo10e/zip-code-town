# zip-code-town module

zip-code-town module help to select a town in France 

## Illustration:

![alt example of use](./doc/zip-code-town.png)

## zip-code-town component

zip-code-town component attributes : 

| attribute | description | structure |
|---|---|---|
| `zip-code-town` |read-write object structured | `{zipCode: String, town: String}` |

Exemple of integration :

    <zip-code-town zip-code-town="$ctrl.zipCodeTown"></zip-code-town>
    
## zip-code-town service

zip-code-town service that returns zip-code-towns

Exemple of integration :

    zipCodeTownService
      .getList(zipCode)
      .then(zipCodeTowns => {
        this.zipCodeTowns = zipCodeTowns;
      });
    
NB. This service loads json files located in `data/zip-code/`
