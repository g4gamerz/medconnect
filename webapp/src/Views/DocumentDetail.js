import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from '@mui/material/Link';
import Tags from './Tags';

// Helper function to make property keys more readable
const formatKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').trim();
};

// --- THIS COMPONENT IS NOW UPDATED ---
function GuidelineDetail({ document }) {
  const createMarkup = (htmlContent) => {
    return {__html: htmlContent};
  };

  // Helper to format dates to DD.MM.YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  return (
    <Stack spacing={2.5}>
      {/* Bug Fix: Changed document.Tags to document.tags */}
      <Tags tags={document.tags} date={document.Stand} /> 
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {document.Indication}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Source: <Link href={document.Quelle} target="_blank" rel="noopener">{document.Quelle}</Link>
      </Typography>

      {/* Bug Fix: Placed dates in a robust flex container */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Start Date:</strong> {formatDate(document.Stand)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Expiry Date:</strong> {formatDate(document.Gueltigkeit)}
        </Typography>
      </Box>

      {/* Render HTML content from the 'Neuerung' field */}
      {document.Neuerung && (
        <Box sx={{ mt: 2, "& ul": { pl: 2.5 }, "& li": { mb: 1 } }} dangerouslySetInnerHTML={createMarkup(document.Neuerung)} />
      )}
    </Stack>
  );
}


function PaperDetail({ document }) {
  const fieldsToIgnore = [
    'Title', 'Authors', 'Abstract', 'PubMedLink', 'tags',
    'PublicationDate', 'Disease', 'id', 'category', 'name', 'description', 'PMID'
  ];
  const detailFields = Object.entries(document)
    .filter(([key]) => !fieldsToIgnore.includes(key) && document[key]);

  return (
    <Stack spacing={2.5}>
      <Tags tags={document.tags} date={document.PublicationDate} />
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {document.Title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {document.Authors}
      </Typography>
      <Box>
         <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Abstract:
        </Typography>
        <Typography variant="body1">
          {document.Abstract}
        </Typography>
      </Box>
      {detailFields.map(([key, value]) => (
        <Box key={key}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            {formatKey(key)}:
          </Typography>
          <Typography variant="body2">
            {value.toString()}
          </Typography>
        </Box>
      ))}
      <Link href={document.PubMedLink} target="_blank" rel="noopener" sx={{ fontWeight: 'bold' }}>
        View on PubMed (PMID: {document.PMID})
      </Link>
    </Stack>
  );
}

function DrugDetail({ document }) {
  const fieldsToIgnore = [
    'Produktname', 'Tags', 'Zusammenfassung', 'Headline', 'Subheadline', 'Quellen',
    'tags', 'name', 'description', 'id', 'category', 'Datum'
  ];
  const detailFields = Object.entries(document).filter(([key]) => !fieldsToIgnore.includes(key));

  return (
    <Stack spacing={2.5}>
      <Tags tags={document.Tags} date={document.Datum} />
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {document.Produktname}
      </Typography>
      {document.Headline && (
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium', mt: -2 }}>
          {document.Headline}
        </Typography>
      )}
      {document.Subheadline && (
        <Typography variant="h6" color="text.secondary" sx={{ mt: -1 }}>
          {document.Subheadline}
        </Typography>
      )}
      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', pt: 1 }}>
        {document.Zusammenfassung}
      </Typography>
      {document.Quellen && Array.isArray(document.Quellen) && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
            Quellen
          </Typography>
          <Stack>
            {document.Quellen.map((url, index) => (
              <Link key={index} href={url} target="_blank" rel="noopener">
                {url}
              </Link>
            ))}
          </Stack>
        </Box>
      )}
      {detailFields.map(([key, value]) => (
        <Box key={key}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
            {key.replace(/_/g, ' ')}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {Array.isArray(value) ? value.join('\n') : value}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

function KonsiliumDetail({ document }) {
  return (
    <Stack spacing={2}>
      <Tags tags={document.tags} date={document.Datum} />
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {document.Headline}
      </Typography>
      <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Frage:
        </Typography>
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
          "{document.Frage}"
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{mt: 1}}>
          - {document.Fragesteller}
        </Typography>
      </Box>
      <Box>
         <Typography variant="subtitle2" color="text.secondary">
          Antwort:
        </Typography>
        <Typography variant="body1">
          {document.Antwort}
        </Typography>
      </Box>
      <Typography variant="caption" display="block" color="text.secondary" align="right">
        {document.Autor} - {new Date(document.Datum).toLocaleDateString('de-DE')}
      </Typography>
    </Stack>
  );
}

/// Main Document Detail View
export default function DocumentDetail({ document, back }) {
  const renderDetail = () => {
    switch (document.category) {
      case 'GUIDELINE':
        return <GuidelineDetail document={document} />;
      case 'PAPER':
        return <PaperDetail document={document} />;
      case 'KONSILIUM':
        return <KonsiliumDetail document={document} />;
      case 'DRUG':
        return <DrugDetail document={document} />;
      default:
        return (
          <Stack spacing={1}>
            <Tags tags={document.tags} />
            <Box sx={{ mt: 2, mb: 1, fontSize: 25, fontWeight: 'bold' }}>
              {document.name}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {document.description}
            </Typography>
          </Stack>
        );
    }
  };

  return (
    <Box sx={{ mx: 2, my: 2 }}>
      <IconButton onClick={back} sx={{ color: 'black', alignSelf: 'flex-start', mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>
      {renderDetail()}
    </Box>
  );
}