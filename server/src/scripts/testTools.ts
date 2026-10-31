import { listOrdersTool, getOrderTool } from "../agent/tools.js";
import { pool } from "../db/client.js";

const result = async() =>{
    const response = await getOrderTool.invoke({id:1})
    console.log(response);
}
result();