const PROTO = "./customers.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const customerProtoLoaded =
  grpc.loadPackageDefinition(packageDefinition).CustomerService;

const client = new customerProtoLoaded(
  "127.0.0.1:30047",
  grpc.credentials.createInsecure()
);

module.exports = client;
