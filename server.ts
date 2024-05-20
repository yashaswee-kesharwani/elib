import app from './src/app'
const startSever = () => {
    const port = process.env.PORT || 3000;
    app.listen(port,()=>{
        console.log('Listening to Port: ${port}');
    });
}

startSever();
