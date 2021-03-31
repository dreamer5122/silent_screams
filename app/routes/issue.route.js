const { categories } = require('../models');

module.exports = function(app) {
 
    const issues = require('../controllers/issue.controller');
    const users = require('../controllers/user.controller');
    // const categories = require('../controllers/category.controller'); 
 
    // Create a new Issue
    app.post('/api/issues', issues.createIssue);

    // my issue
    app.get('/api/issues/myIssues', issues.myIssues);

    //Retrive Approved Issues
    app.get('/api/issues/getApproved', users.allowIfLoggedIn, issues.getApproved);

    // Retrieve a single Issue by Id
    app.get('/api/issues/:issueId', issues.findIssueById);




    // ADMIN SECTION


    // Retrieve all issues
    app.get('/api/issues', issues.findAll);

    //Retrive Declined Issues
    app.get('/api/issues/getDeclined', issues.adminGetDeclined);

    //Retrive pending Issues
    app.get('/api/issues/pending', issues.adminPendingIssues);

    // Update an Issue with Id
    app.put('/api/issues/:issueId', issues.updateIssue);

    // Approve an issue
    app.post('/api/issues/:issueId/approve', issues.approveIssue);

    // decline an issue
    app.post('/api/issues/:issueId/decline', issues.declineIssue);
 
    // Delete an Issue with Id
    app.delete('/api/issues/:issueId', issues.deleteIssue);

    // app.get('/api/issues/comment/:id', issues.findByIssue);

    // Create a comment for an Issue
    app.post('/api/issues/:issueId/comment', issues.createComment);

    // get issues by category
    app.get('/api/issues/:categoryId/issues', issues.getIssuesByCategory);
}
