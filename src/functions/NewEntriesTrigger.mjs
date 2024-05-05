import { app } from '@azure/functions';
import { Octokit } from "@octokit/core";

app.cosmosDB('NewEntriesTrigger', {
    connection: 'swadb_DOCUMENTDB',
    databaseName: 'i-painted-this',
    containerName: 'Entries',
    createLeaseCollectionIfNotExists: true,
    handler: async (documents, context) => {
        context.log(`Cosmos DB function processed ${documents.length} documents`);
        // Octokit.js
        // https://github.com/octokit/core.js#readme
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        })

        await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
            owner: process.env.GITHUB_REPOSITORY_OWNER,
            repo: process.env.GITHUB_REPOSITORY,
            event_type: 'function_trigger',
            client_payload: {
                docCount: documents.length
            },
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
    }
});
