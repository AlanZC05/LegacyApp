
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env from the server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const testConnection = async () => {
    const uri = process.env.MONGODB_URI;
    console.log('Testing MongoDB Connection...');
    console.log('URI length:', uri ? uri.length : 0);

    if (!uri) {
        console.error('MONGODB_URI is missing in .env');
        return;
    }

    // Mask password for safety in logs
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log(`Connecting to: ${maskedUri}`);

    try {
        await mongoose.connect(uri);
        console.log('✅ Connection Successful!');
        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error: any) {
        console.error('❌ Connection Failed:', error.message);
        if (error.code === 8000) {
            console.error('This often indicates an authentication failure (wrong username/password).');
        } else if (error.codeName === 'AtlasError') {
            console.error('Atlas Error - Likely IP whitelist issue or bad credentials.');
        } else {
            console.error('Detailed Error:', error);
        }
    }
};

testConnection();
