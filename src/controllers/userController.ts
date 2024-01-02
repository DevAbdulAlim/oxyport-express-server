import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { db } from '../config/database';
import { generateVerifyToken } from '../utils/verifyToken';
import bcrypt from 'bcrypt';

// User-related functions
export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const users = await db.user.findMany();

  res.status(200).json({
    success: true,
    users,
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.userId, 10);

  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  const createdUser = await db.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  res.status(201).json({
    success: true,
    user: createdUser,
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.userId, 10);
  const { name, email, password } = req.body;

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      password,
    },
  });

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.userId, 10);

  const deletedUser = await db.user.delete({
    where: { id: userId },
  });

  if (!deletedUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});


export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({where: {email}});

  if(!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    })
  }

  const idPasswordValid = await bcrypt.compare(password, user.password);

  if (!idPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    })
  }

  const authToken = await generateVerifyToken(user.id, user.role, res);

  res.status(200).json({
    success: true,
    user,
    authToken
  })

});

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username, email, and password are required fields.',
    });
  }

  const hashedPassword =  await bcrypt.hash(password, 10);

  const createdUser = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword, 
    },
  });

  res.status(201).json({
    success: true,
    user: createdUser,
  });
});
