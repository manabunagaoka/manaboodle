#!/bin/bash
# Migration script for Vercel deployment
npx prisma generate
npx prisma db push --accept-data-loss
