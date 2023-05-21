import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  styled,
} from "@mui/material";

const BasicCard = ({
  subtitle,
  title,
  content,
  action,
  actionText,
  action2Text,
  action2,
  img,
}: any) => {
  return (
    <Card sx={{ width: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {subtitle}
        </Typography>
        {!!img ?
          <ImageWrapper src={img} />
          :
          <Typography variant="h5" component="div">
            {title}
          </Typography>
        }

        <Typography variant="body2">{content}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={action} size="small">
          {actionText}
        </Button>
        <Button onClick={action2} size="small">
          {action2Text}
        </Button>
      </CardActions>
    </Card>
  );
};

export default BasicCard;

const ImageWrapper = styled('img')(() => ({
  maxWidth: 230,
  borderRadius: '15px'
}))