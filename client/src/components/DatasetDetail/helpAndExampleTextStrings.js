import supportLink from '../../constants/constants';

export const helpText = `Use the text area on the left to formulate a SQL query, and press \`Run\` below to receive the results in a CSV file. 

This tool will execute any valid [BigQuery standard SQL](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax) query. Only the table name needs to be provided, not the dataset or project name. Refer to the Collections tab on the far left for a list of tables and columns. 

Refer to the 'Examples' tab above for sample queries.

We cap the number of bytes computed per user per month at 20GB. Please [reach out](${supportLink}) for more.

**Note:** All columns of type array (\`[STRING]\`, \`[[FLOAT]]\`, etc.) are stored as strings of Python \`list\` literals. Use \`ast.literal_eval\` to convert them to the Python \`list\` type:

    >>> import ast
    >>> ast.literal_eval("[1, 2, 3]")
    [1, 2, 3]

Please [reach out](${supportLink}) about anything!`;

export const examplesText = `**Example #1:** 

    SELECT title, 
        time_signature, 
        end_of_fade_in FROM main
    WHERE year > 1900 
        AND duration > 240 
    LIMIT 100

**Example #2:**

    SELECT year, 
        AVG(loudness) as avg_loudness FROM main
    GROUP BY year
    ORDER BY avg_loudness DESC
    LIMIT 3`;
