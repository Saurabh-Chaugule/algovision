-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_algorithms" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "algorithmType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "configuration" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_algorithms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "execution_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "algorithmType" TEXT NOT NULL,
    "algorithmName" TEXT NOT NULL,
    "inputData" JSONB NOT NULL,
    "steps" JSONB NOT NULL,
    "executionTime" INTEGER NOT NULL,
    "comparisons" INTEGER,
    "swaps" INTEGER,
    "iterations" INTEGER,
    "spaceComplexity" TEXT,
    "timeComplexity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "execution_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "algorithms" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeComplexity" JSONB NOT NULL,
    "spaceComplexity" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "algorithms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "saved_algorithms_userId_idx" ON "saved_algorithms"("userId");

-- CreateIndex
CREATE INDEX "saved_algorithms_algorithmType_idx" ON "saved_algorithms"("algorithmType");

-- CreateIndex
CREATE INDEX "execution_history_userId_idx" ON "execution_history"("userId");

-- CreateIndex
CREATE INDEX "execution_history_algorithmType_idx" ON "execution_history"("algorithmType");

-- CreateIndex
CREATE INDEX "execution_history_createdAt_idx" ON "execution_history"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "algorithms_type_key" ON "algorithms"("type");

-- CreateIndex
CREATE INDEX "algorithms_category_idx" ON "algorithms"("category");

-- AddForeignKey
ALTER TABLE "saved_algorithms" ADD CONSTRAINT "saved_algorithms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution_history" ADD CONSTRAINT "execution_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
