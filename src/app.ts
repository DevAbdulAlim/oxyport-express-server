import express from 'express';
import productRoutes from './routes/productRoute'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

app.use('/api', productRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})