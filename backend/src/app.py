from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

# para poder operar con los componentes necesito inicializar unas instancias...
app = Flask(__name__)
# configurando la direccion de la base de datos...
# pthonreactfb sera mi nueva base de datos
app.config['MONGO_URI']='mongodb://localhost/pythonreactdb'
mongo = PyMongo(app)

#hago referencia a la coleccion users 
db = mongo.db.users

# esto es como un middleware de express
CORS(app)


# Necesito rutas para las operaciones del CRUD
# creamos nuestra REST API
@app.route('/users',methods=['POST'])
def createUser():
    """
        Descripcion: A traves de la base de datos de mongo inserta un nuevo usuario con los datos obtenidos desde la peticion (request)
        Valor de retorno: devuelve como respuesta el id del documento almacenado en la bd de mongo
    """
    id = db.insert({
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    })
    return jsonify(str(ObjectId(id)))

@app.route('/users',methods=['GET'])
def getUsers():
    users = []
    for doc in db.find():
        users.append({
            '_id':str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password']
        })
    return jsonify(users)

@app.route('/users/<id>',methods=['GET'])
def getUser(id):
    user = db.find_one({'_id':ObjectId(id)})
    return jsonify({
        '_id': str(ObjectId(user['_id'])),
        'name': user['name'],
        'email': user['email'],
        'password': user['password']
    })

@app.route('/users/<id>',methods=['DELETE'])
def deleteUser(id):
    db.delete_one({'_id':ObjectId(id)})
    return jsonify({'msg':'Usuario eliminado'})

@app.route('/users/<id>',methods=['PUT'])
def updateUser(id):
    db.update_one({'_id':ObjectId(id)},{'$set':{
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    }})
    return jsonify('user updated')

if __name__ == "__main__":
    app.run(debug=True)