-- CreateTable
CREATE TABLE "SurveyInviteSend" (
    "id" TEXT NOT NULL,
    "inviteId" TEXT NOT NULL,
    "sendNumber" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),

    CONSTRAINT "SurveyInviteSend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SurveyInviteSend" ADD CONSTRAINT "SurveyInviteSend_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "SurveyInvite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
