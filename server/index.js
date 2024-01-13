const PROTO = "./customers.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const customersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const customers = [
  {
    id: "12",
    name: "Surya Kaliyaperumal",
    age: 24,
    address: "Bangalore",
  },
  {
    id: "15",
    name: "Surendhar Kaliyaperumal",
    age: 28,
    address: "Chennai",
  },
];

server.addService(customersProto.CustomerService.service, {
  getAll: (call, callback) => {
    callback(null, { customers });
  },
  get: (call, callback) => {
    let customer = customers.find((n) => n.id == call.request.id);

    if (customer) {
      callback(null, customer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
  insert: (call, callback) => {
    let customer = call.request;

    customer.id = Math.random(); // uuidv4
    customers.push(customer);
    callback(null, customer);
  },
  update: (call, callback) => {
    let existingCustomer = customers.find((n) => n.id == call.request.id);

    if (existingCustomer) {
      existingCustomer.name = call.request.name;
      existingCustomer.age = call.request.age;
      existingCustomer.address = call.request.address;
      callback(null, existingCustomer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
  remove: (call, callback) => {
    let existingCustomerIndex = customers.findIndex(
      (n) => n.id == call.request.id
    );

    if (existingCustomerIndex != -1) {
      customers.splice(existingCustomerIndex, 1);
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
});

server.bindAsync(
  "127.0.0.1:30047",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.log("error on server file : ", err);
    } else {
      server.start();
      console.log("GRPC Server is listening to ", port);
    }
  }
);
