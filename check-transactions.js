const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTransactions() {
  try {
    console.log('Checking recent transactions...');
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: {
            email: true,
            clerkId: true
          }
        }
      }
    });
    
    console.log(`Found ${transactions.length} transactions:`);
    transactions.forEach((t, i) => {
      console.log(`${i + 1}. ID: ${t.id}`);
      console.log(`   User: ${t.user.email}`);
      console.log(`   Amount: ${t.amount} ${t.currency}`);
      console.log(`   Credits: ${t.credits}`);
      console.log(`   Status: ${t.status}`);
      console.log(`   Gateway: ${t.paymentGateway}`);
      console.log(`   Razorpay Order ID: ${t.razorpayOrderId}`);
      console.log(`   Created: ${t.createdAt}`);
      console.log(`   Attempts: ${t.attemptCount}`);
      console.log('   ---');
    });
    
    // Also check total count
    const totalCount = await prisma.transaction.count();
    console.log(`\nTotal transactions in database: ${totalCount}`);
    
  } catch (error) {
    console.error('Error checking transactions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTransactions();