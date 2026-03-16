-- CreateTable
CREATE TABLE "SurveyInvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT,
    "advisor" TEXT NOT NULL,
    "relationshipNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "inviteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "npsScore" INTEGER NOT NULL,
    "journeyStage" TEXT NOT NULL,
    "strengths" TEXT NOT NULL DEFAULT '',
    "improvements" TEXT NOT NULL DEFAULT '',
    "otherComments" TEXT NOT NULL DEFAULT '',
    "contactEase" INTEGER NOT NULL,
    "reportClarity" INTEGER NOT NULL,
    "modelTransparency" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "planningFit" INTEGER NOT NULL,
    "interestAlignment" INTEGER NOT NULL,
    "meetingFrequency" INTEGER NOT NULL,
    "solutionsSupport" INTEGER NOT NULL,
    "meetingClarity" INTEGER NOT NULL,
    "engagement" INTEGER NOT NULL,
    "advisorRelevance" INTEGER NOT NULL,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SurveyInvite_token_key" ON "SurveyInvite"("token");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyResponse_inviteId_key" ON "SurveyResponse"("inviteId");

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "SurveyInvite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

