import mongoose from "mongoose";

Schema=mongoose.Schema;

let deaoSchema= new Schema(Schema.Types.Mixed, {strict:false});

export default mongoose.model('deao',deaoSchema);

