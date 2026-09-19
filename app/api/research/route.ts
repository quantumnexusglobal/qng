import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { sendAdminNotification } from '@/lib/email';
import { saveServerSubmission, getServerSubmissions, updateServerSubmissionStatus, deleteServerSubmission } from '@/lib/server-storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const applicantName = (body.fullName || body.name || '').trim();
    const applicantEmail = (body.email || '').trim().toLowerCase();

    const applicationDoc = {
      ...body,
      id: body.id || `rg-${Date.now()}`,
      fullName: applicantName,
      email: applicantEmail,
      status: body.status || 'Under Review',
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Server Storage (Guaranteed fallback)
    saveServerSubmission('research', applicationDoc);

    // 2. Save to MongoDB
    let insertedId = null;
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        const collection = db.collection('research_grants');
        const result = await collection.insertOne(applicationDoc);
        insertedId = result.insertedId;
      }
    } catch (dbErr) {
      console.warn('[MongoDB Research] DB write error:', dbErr);
    }

    // 3. Trigger Admin Email Notification for Research Proposal
    if (applicantEmail && applicantName) {
      const supportList = Array.isArray(body.supportTypes) ? body.supportTypes.join(', ') : body.supportTypes;
      const messageContent = [
        `Project Abstract:\n${body.projectAbstract || 'N/A'}\n`,
        `Support Requested: ${supportList || 'Not specified'}`,
        `Paper Status: ${body.currentPaperStatus || 'Work In Progress'}`,
        `Compute Requested: ${body.computeHoursRequested || 'N/A'}`,
        body.githubOrArxiv ? `GitHub / arXiv: ${body.githubOrArxiv}` : '',
      ].filter(Boolean).join('\n');

      await sendAdminNotification({
        formType: 'Research Grant Proposal',
        name: applicantName,
        email: applicantEmail,
        phone: body.phone,
        organization: body.institution,
        position: body.programLevel,
        expertise: body.researchDomain,
        subject: body.projectTitle || 'Quantum Research Grant Proposal',
        message: messageContent,
      }).catch((err) => {
        console.warn('[Email] Research grant notification error:', err);
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Research Support application submitted successfully',
        id: insertedId || applicationDoc.id,
        data: applicationDoc,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in /api/research POST:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const serverResearch = getServerSubmissions('research');

    let mongoResearch: any[] = [];
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        mongoResearch = await db
          .collection('research_grants')
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
      }
    } catch (dbErr) {
      console.warn('[MongoDB GET Research] DB read error:', dbErr);
    }

    const combined: any[] = [...serverResearch];
    mongoResearch.forEach((mr) => {
      const formatted = {
        id: mr._id ? String(mr._id) : mr.id || `rg-${Date.now()}`,
        fullName: mr.fullName || mr.name || 'Anonymous',
        email: mr.email || '',
        phone: mr.phone || '',
        institution: mr.institution || 'Independent',
        programLevel: mr.programLevel || 'Student',
        researchDomain: mr.researchDomain || 'Quantum Computing',
        projectTitle: mr.projectTitle || 'Untitled Research',
        projectAbstract: mr.projectAbstract || '',
        supportTypes: mr.supportTypes || [],
        currentPaperStatus: mr.currentPaperStatus || 'Work in progress',
        githubOrArxiv: mr.githubOrArxiv || '',
        computeHoursRequested: mr.computeHoursRequested || '',
        createdAt: mr.createdAt ? new Date(mr.createdAt).toISOString() : new Date().toISOString(),
        status: mr.status || 'Under Review',
      };
      if (!combined.some((c) => (c.email && c.email.toLowerCase() === formatted.email.toLowerCase() && c.projectTitle === formatted.projectTitle) || c.id === formatted.id)) {
        combined.push(formatted);
      }
    });

    return NextResponse.json({ success: true, data: combined });
  } catch (error: any) {
    console.error('Error in /api/research GET:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      );
    }

    updateServerSubmissionStatus('research', id, status || 'Under Review');

    try {
      const db = await getMongoDbDatabase();
      if (db) {
        await db.collection('research_grants').updateOne(
          { $or: [{ id }, { _id: id }] },
          { $set: { status, updatedAt: new Date() } }
        );
      }
    } catch (dbErr) {
      console.warn('[MongoDB PUT Research] DB update error:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error: any) {
    console.error('Error in /api/research PUT:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      );
    }

    deleteServerSubmission('research', id);

    try {
      const db = await getMongoDbDatabase();
      if (db) {
        await db.collection('research_grants').deleteOne({ $or: [{ id }, { _id: id }] });
      }
    } catch (dbErr) {
      console.warn('[MongoDB DELETE Research] DB delete error:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Application deleted' });
  } catch (error: any) {
    console.error('Error in /api/research DELETE:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
