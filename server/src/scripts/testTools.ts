import { listOrdersTool } from "../agent/tools.js";
import { pool } from "../db/client.js";

const result = async() =>{
    const response = await listOrdersTool.invoke({ customer : "Mehta"})
    console.log(response);
}
result();