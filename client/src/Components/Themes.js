import { createMuiTheme } from '@material-ui/core/styles';

export default themeName => {


  let theme = {
    palette: {
      primary: {
        main:"#2962ff",
        light:"#768fff",
        dark:"#0039cb",
        contrastText:"#fff"
      },
      secondary: {
        main: '#2196f3',
        light:"#6ec6ff",
        dark:"#0069c0",
        contrastText:"#fff"
      },
    },
  }

  switch(themeName){
    case "dark":
      theme = {
        ...theme,
        palette:{
          ...theme.palette,
          type: 'dark',
          background:{
            paper:"#2d2d2d",
            default: "#222222"
          },
        }
      }
    break;

    case "dark pro":
      theme = {
        ...theme,
        palette:{
          ...theme.palette,
          type: 'dark',
          background:{
            paper:"#282c34",
            default: "#21252b"
          },
        }
      }
    break;

    case "palenight":
      theme = {
        ...theme,
        palette:{
          ...theme.palette,
          type: 'dark',
          background:{
            paper:"#292d3e",
            default: "#1b1e2b"
          },
        }
      }
    break;

    default: break;
  }

  return createMuiTheme(theme);

}