import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

const BasicCard = ({ subtitle, title, content, action, actionText }: any) => {
  return (
    <Card sx={{ width: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {subtitle}
        </Typography>
        <Typography variant="h5" component="div">
          {title}
        </Typography>

        <Typography variant="body2">{content}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={action} size="small">
          {actionText}
        </Button>
      </CardActions>
    </Card>
  );
};

export default BasicCard;
