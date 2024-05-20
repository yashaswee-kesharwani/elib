import connectDB from './src/config/db';
import { config } from './src/config/config';
import app from './src/app'

const startSever = async () => {
    await connectDB();
    const port = config.port || 3000;
    app.listen(port,()=>{
        console.log('Listening to Port:',port);
    });
}

startSever();
